import { Component } from 'react';

export default class ErrorBoundary extends Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
    return { hasError: true, error };
    }

    componentDidCatch(error, info) {
    console.error('Error Boundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
        return (
            <div className="error-fallback">
            <h2>Something went wrong</h2>
            <details>
                {this.state.error.toString()}
                <br />
                {this.state.error.stack}
            </details>
            </div>
        );
        }
        return this.props.children;
    }
}