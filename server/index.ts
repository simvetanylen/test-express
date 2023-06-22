import srvapp from './srvapp';
import {eventEmitter} from "./event-emitter";
import {registerPolicies} from "./custom/register-policies";
import {BasketPolicies} from "./baskets/policies";
import {BasketsService} from "./baskets/baskets-service";

const port = 3000;

const basketService = new BasketsService()

const basketPolicies = new BasketPolicies(basketService)

registerPolicies(eventEmitter, basketPolicies)

srvapp.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${port}`);
    /* eslint-enable no-console */
});