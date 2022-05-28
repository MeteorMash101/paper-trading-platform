import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // helps trigger user events on this virtual screen.
import StockDetail from './StockDetail';
import { MemoryRouter } from 'react-router-dom';

describe('StockDetail component', () => {
    // make tests here...
    test('switches from Buy to -> Sell mode properly.', () => {
        // [Arrange]:
        render(<StockDetail/>, {wrapper: MemoryRouter}); // wrapper required b/c this component inside <Router/>

        // [Assert]:
        const sellMsgStartsWith = "You have ... shares available";
        const orderTypeMsg = screen.getByText(sellMsgStartsWith, {exact: false}); // Not exact matches here for messages
        expect(orderTypeMsg).toBeInTheDocument();
    });
});