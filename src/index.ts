import * as _ from 'lodash';

export interface ToseqOptions {
    separator?: string;
    strict?: boolean;
    allowReverse?: boolean;
}

const DefaultOptions: ToseqOptions = {
    separator: ',',
    strict: true,
    allowReverse: true
};

export function stringify (array: number[], options: ToseqOptions = DefaultOptions) {
    options = _.extend(DefaultOptions, options);
    array = options.strict ? array : array.sort((a, b) => a - b);
    let min = array[0],
        max = null,
        result = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i+1] === array[i]+1) {
            max = array[i+1];
        } else {
            if (max !== null) {
                result.push(`${min}-${max}`);
            } else {
                result.push(min);
            }
            max = null;
            min = array[i+1];
        }
    }
    return result.join(options.separator);
}

export function parse (str: string, options: ToseqOptions = DefaultOptions) {
    options = _.extend(DefaultOptions, options);
    let blocks = str
        .trim()
        .replace(/\s*/g, '')
        .split(options.separator)
        .filter(value => !!value);
    let result = [];
    blocks.map(value => {
        let preparedValue = value.split('-');
        if (preparedValue.length == 1) {
            result.push(+preparedValue[0]);
        } else if (preparedValue.length == 2) {
            let [first, second] = preparedValue;
            if (first > second && options.allowReverse) {
                result.push(..._.range(+first, +second-1))
            } else if (first > second && !options.allowReverse) {
                throw new Error(`Reversed ranges is disallowed: [${first}-${second}]`);
            } else {
                result.push(..._.range(+first, +second+1));
            }
        } else throw new Error('Invalid format of string');
    });
    return options.strict ? result : result.sort((a, b) => a - b);
}

export default function (options: ToseqOptions = DefaultOptions) {
    options = _.extend(DefaultOptions, options);
    return {
        stringify (array: number[]) {
            return stringify(array, options);
        },
        parse (str: string) {
            return parse(str, options);
        }
    }
}