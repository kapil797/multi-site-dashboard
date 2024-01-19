export const is = (fileName: string, ext: string) => new RegExp(`.${ext}$`).test(fileName);
