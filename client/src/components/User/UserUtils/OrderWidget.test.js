import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // helps trigger user events on this virtual screen.
import OrderWidget from './OrderWidget';
import { MemoryRouter } from 'react-router-dom';

describe('OrderWidget component', () => {
    // make tests here...
    test('switches from Buy to -> Sell mode properly.', () => {
        // [Arrange]:
        render(<OrderWidget livePrice={10.00} stock={{symbol: "AAPL"}}/>, {wrapper: MemoryRouter}); // wrapper required b/c this component inside <Router/>

        // [Act]:
        // make sure on buy button first, then click the sell button.
        const buyButton = screen.getByTestId('buyButton');
        const sellButton = screen.getByTestId('sellButton');
        userEvent.click(buyButton)
        userEvent.click(sellButton)

        // [Assert]:
        const sellMsgStartsWith = "You have ... shares available";
        const orderTypeMsg = screen.getByText(sellMsgStartsWith, {exact: false}); // Not exact matches here for messages
        expect(orderTypeMsg).toBeInTheDocument();
    });
});

describe('OrderWidget component', () => {
    // make tests here...
    test('switches from Sell to -> Buy mode properly.', () => {
        // [Arrange]:
        render(<OrderWidget livePrice={10.00} stock={{symbol: "AAPL"}}/>, {wrapper: MemoryRouter}); // wrapper required b/c this component inside <Router/>

        // [Act]:
        // make sure on buy button first, then click the sell button.
        const buyButton = screen.getByTestId('buyButton');
        const sellButton = screen.getByTestId('sellButton');
        userEvent.click(sellButton)
        userEvent.click(buyButton)

        // [Assert]:
        const buyMsgStartsWith = "You currently own ... shares";
        const orderTypeMsg = screen.getByText(buyMsgStartsWith, {exact: false}); // Not exact matches here for messages
        expect(orderTypeMsg).toBeInTheDocument();
    });
});