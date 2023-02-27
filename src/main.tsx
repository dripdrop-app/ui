import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';

import App from './App';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<HelmetProvider>
					<Helmet titleTemplate="%s | dripdrop" defaultTitle="dripdrop" />
					<App />
				</HelmetProvider>
			</Provider>
		</BrowserRouter>
	</React.StrictMode>
);
