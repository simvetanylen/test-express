import {ClassConstructor, plainToInstance, Transform} from "class-transformer";
import {Collection, Document, Filter, ObjectId} from "mongodb";

export class PersistenceConflictException {
}

export class PersistenceNotFoundException {
    message: string

    constructor(message: string) {
        this.message = message;
    }
}

export class PersistenceResultError {
    message: string

    constructor(message: string) {
        this.message = message;
    }
}

export class PersistenceParameterError {
    message: string

    constructor(message: string) {
        this.message = message;
    }
}

export abstract class VersionedDocument {
    @Transform(params => params.obj._id)
    readonly _id?: ObjectId
    _version: number = 0
}

export abstract class OptimisticRepository<AGGREGATE extends VersionedDocument & Document> {

    private collection: Collection;
    private ctor: any;

    // TODO : not really nice to need a constructor ref
    protected constructor(collection: Collection, aggregateConstructor: ClassConstructor<AGGREGATE>) {
        this.collection = collection;
        this.ctor = aggregateConstructor;
    }

    public async findOne(id: string): Promise<AGGREGATE> {
        const res = await this.collection.findOne({
            _id: new ObjectId(id)
        })

        if (res === null) {
            throw new PersistenceNotFoundException(`Document with id ${id} not found`)
        }

        return plainToInstance(this.ctor, res as {}) as AGGREGATE
    }

    // TODO : See to have something like Filter<AGGREGATE>
    public async findAll(filter: Filter<Document>): Promise<AGGREGATE[]> {
        return (await this.collection.find(filter).toArray())
            .map(doc => {
                return plainToInstance(this.ctor, doc) as AGGREGATE
            })
        // return await this.collection.find(filter)
        //     .toArray()
    }

    public async create(aggregate: Partial<AGGREGATE>): Promise<ObjectId> {
        if (aggregate._id !== undefined) {
            throw new PersistenceParameterError('no id on create')
        }

        aggregate._version = 0

        const res = await this.collection.insertOne({...aggregate})
        return res.insertedId
    }

    public async update(aggregate: AGGREGATE) {
        const nextVersion = aggregate._version + 1

        const result = await this.collection.updateOne({
            _id: aggregate._id,
            _version: aggregate._version
        }, {
            $set: {
                ...aggregate,
                _version: nextVersion
            }
        })

        if (result.modifiedCount == 0) {
            throw new PersistenceConflictException()
        } else if (result.modifiedCount > 1) {
            throw new PersistenceResultError('modified count > 1')
        } else {
            aggregate._version = nextVersion
        }
    }

    public async delete(aggregate: AGGREGATE) {
        const result = await this.collection.deleteOne({
            _id: aggregate._id,
            _version: aggregate._version
        })

        if (result.deletedCount == 0) {
            // TODO : possible that another process deleted that object. In that case maybe ignore the exception.
            throw new PersistenceConflictException()
        } else if (result.deletedCount > 1) {
            throw new PersistenceResultError('deleted count > 1')
        }
    }
}