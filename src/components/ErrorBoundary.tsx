import { Component, type ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { Logo } from './Logo';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="flex justify-center mb-6">
              <Logo size={64} />
            </div>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">
              Quelque chose s'est mal passe
            </h1>
            <p className="text-stone-600 mb-8">
              Une erreur inattendue est survenue. Essayez de recharger la page.
            </p>
            <button
              onClick={this.handleRetry}
              className="btn-primary inline-flex items-center gap-2"
            >
              <RefreshCw size={20} />
              Reessayer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
