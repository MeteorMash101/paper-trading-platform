import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // helps trigger user events on this virtual screen.
import StockItem from './StockItem';
import { MemoryRouter } from 'react-router-dom';
/* NOTE: Best practices for testing:
- we can "describe" this testing suite like so.
- this name + test description should form nice sentences.
- assign "data-testid={"percent_change"}" property to the last part of html DOM elements you want to test on.
- follow the 3 step guideline: Arrange, Act, Assert.
*/
describe('StockItem component', () => {
    // make tests here...
    test('renders "symbol, company_name, price, and percent_change" accordingly.', () => {
        // [Arrange]:
        render(<StockItem/>, {wrapper: MemoryRouter}); // wrapper required b/c this component inside <Router/>

        // [Act]:
        // ...nothing

        // [Assert]:
        const symbolElement = screen.getByTestId('symbol');
        expect(symbolElement).toBeInTheDocument();
        const companyNameElement = screen.getByTestId('company_name');
        expect(companyNameElement).toBeInTheDocument();
        const priceElement = screen.getByTestId('price');
        expect(priceElement).toBeInTheDocument();
        const percentChangeElement = screen.getByTestId('percent_change');
        expect(percentChangeElement).toBeInTheDocument();
    });
});

describe('StockItem component', () => {
    // make tests here...
    test('renders "add watchlist button" accordingly.', () => {
        // [Arrange]:
        render(<StockItem in_watch_list={false}/>, {wrapper: MemoryRouter}); // <- make sure you also pass in proper props you are trying to test.

        // [Act]:
        // ...nothing

        // [Assert]:
        const watchlistBtnElement = screen.getByTestId('watchlist_button_add');
        expect(watchlistBtnElement).toBeInTheDocument();
    });
});

describe('StockItem component', () => {
    // make tests here...
    test('renders "remove watchlist button" accordingly.', () => {
        // [Arrange]:
        render(<StockItem in_watch_list={true}/>, {wrapper: MemoryRouter}); // <- make sure you also pass in proper props you are trying to test.

        // [Act]:
        // ...nothing

        // [Assert]:
        const watchlistBtnElement = screen.getByTestId('watchlist_button_remove');
        expect(watchlistBtnElement).toBeInTheDocument();
    });
});


// TODOS: tests to add: wl btn behavior...? (from here?)

// describe('StockItem component', () => {
//     // make tests here...
//     test('changes watchlist button style from add to remove.', async () => {
//         // [Arrange]:
//         render(<StockItem in_watch_list={false}/>, {wrapper: MemoryRouter});

//         // [Act]:
//         // ...nothing
//         const watchlistBtnAddElement = screen.getByTestId('watchlist_button_add'); 
//         userEvent.click(watchlistBtnAddElement)

//         // [Assert]:
//         const watchlistBtnRemoveElement = await screen.findByTestId('watchlist_button_remove'); 
//         expect(watchlistBtnRemoveElement).toBeInTheDocument();
//     });
// });