export function preload_dict(dict: { [type: string]: any; }): void {
    for(let key in dict) {
        if (dict.hasOwnProperty(key)) {
            dict[key].preload()
        }
    }
}