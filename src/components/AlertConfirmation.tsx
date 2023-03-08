import { Alert } from '@mantine/core';
import { MdCheck, MdError } from 'react-icons/md';

interface AlertConfirmationProps {
	showSuccess?: boolean;
	successMessage?: string;
	showError?: boolean;
	errorMessage?: string;
}

const AlertConfirmation = (props: AlertConfirmationProps) => {
	const { showSuccess, successMessage, showError, errorMessage } = props;

	return (
		<>
			<Alert sx={{ ...(!showSuccess && { display: 'none' }) }} icon={<MdCheck />} title="Success" color="green">
				{successMessage}
			</Alert>
			<Alert sx={{ ...(!showError && { display: 'none' }) }} icon={<MdError />} title="Error" color="red">
				{errorMessage}
			</Alert>
		</>
	);
};

export default AlertConfirmation;
