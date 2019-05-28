const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math')
// If the test case does not throw an error it is considered a success
test('Calculate total with tip', () => {
    const total = calculateTip(10, 0.3)
    expect(total).toBe(13)

    // if (total != 13) {
    //     throw new Error("Total tip should be 13 found " + total) 
    // }
})

test('Calculate total with default  tip', () => {
    const total = calculateTip(10)
    expect(total).toBe(12)
})

test('Test fahrenheitToCelsius', () => {
    const celsius = fahrenheitToCelsius(32)
    expect(celsius).toBe(0)
})

test('Test celsiusToFahrenheit', () => {
    const farenith = celsiusToFahrenheit(0)
    expect(farenith).toBe(32)
})

// test('Async code', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000)
// })

test('Should add two numbers', (done) => {
    add(2,3).then((sum) => {
        expect(sum).toBe(5)
        done()
    })
})

test('Should add two numbers Await Async', async () => {
    const sum = await add(2,3)
    expect(sum).toBe(5)
})

