import { Component } from 'react';

export default class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Error Boundary:', error, info);
    }

    render() {
        return this.state.hasError ? <Error /> : this.props.children;
    }
}