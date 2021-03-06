import 'reflect-metadata';
import { bootstrapMicroframework } from "microframework-w3tec";
import { iocLoader } from './Loaders/iocLoader';
import { expressLoader } from "./Loaders/expressLoader";

bootstrapMicroframework({
    /**
     * Loader is a place where you can configure all your modules during microframework
     * bootstrap process. All loaders are executed one by one in a sequential order.
     */
    loaders: [
		iocLoader,
        expressLoader,
    ],
})
.then(() => {
	console.log("application started");
})
.catch((error) => console.log('Application is crashed: ' + error));