import { Plastic } from './plastic';
import { preload_dict } from '../util/preload';

export class Armors {
    private static readonly armors: { [type: string]: any; } = {
        'plastic' : Plastic
    }

    public static preload(): void {
        preload_dict(Armors.armors)
    }
}