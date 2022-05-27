import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // helps trigger user events on this virtual screen.
import StockItem from './StockItem';
import { MemoryRouter } from 'react-router-dom';

// we can "describe" this testing suite like so.
// this name + test description should form nice sentences.
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
