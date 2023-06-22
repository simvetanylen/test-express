import express from "express";
import {BasketsService} from "./baskets-service";
import {plainToInstance} from "class-transformer";
import {AddArticle} from "./commands";

const router = express.Router()

const basketsService = new BasketsService()

router.get('/baskets', async (req, res) => {
    res.json(await basketsService.findAll());
})

router.post('/baskets', async (req, res) => {
    const result = await basketsService.create()
    res.json(result)
})

router.post('/baskets/:id/articles', async (req, res) => {
    const id = req?.params?.id;
    const inst = plainToInstance(AddArticle, req.body as string)
    const result = await basketsService.addArticle(id, inst)

    res.json(result)
})

export default router