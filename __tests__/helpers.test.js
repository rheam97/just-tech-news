const {format_date, format_plural, format_url} = require('../utils/helpers')


test('format_data() returns a data string', ()=> {
    const date = new Date('2020-03-20 16:12:03')
    expect(format_date(date)).toBe('3/20/2020')
})

test('format_plural() returns plural words if applicable', ()=> {
    
    expect(format_plural("tiger", 2)).toBe('tigers')
    expect(format_plural("lion", 1)).toBe('lion')
})

test('format_url() returns simplified url string', ()=> {
    const url = 'https://www.url.com'
    const result = 'url.com'
    const url1 = 'https://www.coolstuff.com/abcdefg/'
    const result1 = 'coolstuff.com'
    const url2 = 'http://test.com/page/1'
    const result2 = 'test.com'
    const url3 = 'https://www.google.com?q=hello'
    const result3 = 'google.com'
    expect(format_url(url)).toBe(result)
    expect(format_url(url1)).toBe(result1)
    expect(format_url(url2)).toBe(result2)
    expect(format_url(url3)).toBe(result3)
})