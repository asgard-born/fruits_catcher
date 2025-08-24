import { Enum } from "cc";

export enum FruitType {
    None = 0,
    Banana = 1,
    BlackCherry = 2,
    BlackBerryDark = 3,
    BlackBerryLight = 4,
    Coconut = 5,
    GreenApple = 6,
    GreenGrape = 7,
    Lemon = 8,
    Lime = 9,
    Mushroom = 10,
    Orange = 11,
    Peach = 12,
    Pear = 13,
    Plum = 14,
    Raspberry = 15,
    RedApple = 16,
    RedCherry = 17,
    RedGrape = 18,
    StarFruit = 19,
    Strawberry = 20,
    Watermelon = 21,
}

export const FruitTypeEnum = Enum(FruitType);
