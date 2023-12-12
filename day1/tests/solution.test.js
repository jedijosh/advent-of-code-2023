const solution = require('../solution')

test('text replacement works on line 1', async () => {
    expect(await solution.replaceTextWithNumbers('two1nine')).toBe('219');
});

test('text replacement works on line 1', async () => {
    expect(await solution.replaceTextWithNumbers('eightwothree')).toBe('8wo3');
});

test('part one solution matches', async () => {
    expect(await solution.solvePartOne()).toBe(54239);
});
