import { separateText } from "../functions/generateEmoji/handler"


describe('separateText', () => {

  type testCase = [string, string, string[]]

  const cases: testCase[] = [
    ["1moji", "我", ["我"]],
    ["2moji", "最悪", ["最悪"]],
    ["3moji", "自尊心", ["自尊心"]],
    ["4moji", "以心伝心", ["以心", "伝心"]],
    ["5moji", "あいうえお", ["あいう", "えお"]],
    ["6moji", "チリコンカン", ["チリコ", "ンカン"]],
    ["7moji", "バングラデシュ", ["バングラ", "デシュ"]],
    ["8moji", "キッチンラッシュ", ["キッチン", "ラッシュ"]],
    ["9moji", "ブードゥープリンス", ["ブードゥー", "プリンス"]],
    ["10moji", "Rising Sun", ["Risin", "g Sun"]],
    ["11moji", "Terraformed", ["Terr", "afor", "med"]],
  ]
    
  test.each(cases)('%s', (_name, input, expected) => {
    expect(separateText(input)).toStrictEqual(expected)
  })
})
