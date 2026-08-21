export const state = {
    cursor:  {
        col: 0,
        row: 0
    },
    spans: [],      /* Array for each line and span for each character in each array. */
    characters: [],        /* Array(44) [ "T", "h", "e", … ] */
    brElArr: [],       /* <br> for each line */
    inputBuffer: [],
    mode: "normal"
}