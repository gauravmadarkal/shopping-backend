import {
    MicroframeworkLoader,
    MicroframeworkSettings,
} from 'microframework-w3tec';
import { useContainer } from 'routing-controllers';
import { Container } from 'typedi';

export const iocLoader: MicroframeworkLoader = (
    settings: MicroframeworkSettings | undefined,
) => {
    /**
     * Setup routing-controllers to use typedi container.
     */
    useContainer(Container);
};
