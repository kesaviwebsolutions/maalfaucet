// app/page.js
'use client'

import React, { useState } from 'react'
import {
	TextField,
	Button,
	Snackbar,
	Alert,
	Box,
	Typography,
	Container,
	Paper
} from '@mui/material'
import { styled } from '@mui/system'

// Styled components for a futuristic look
const FuturisticContainer = styled(Container)(({ theme }) => ({
	backgroundColor: '#1a1a1a',
	color: '#ffffff',
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	padding: theme.spacing(4)
}))

const FuturisticTextField = styled(TextField)(({ theme }) => ({
	'& .MuiOutlinedInput-root': {
		'& fieldset': {
			borderColor: '#4a4a4a'
		},
		'&:hover fieldset': {
			borderColor: '#6a6a6a'
		},
		'&.Mui-focused fieldset': {
			borderColor: '#8a8a8a'
		}
	},
	'& .MuiInputLabel-root': {
		color: '#8a8a8a'
	}
}))

const FuturisticButton = styled(Button)(({ theme }) => ({
	backgroundColor: '#4a4a4a',
	color: '#ffffff',
	'&:hover': {
		backgroundColor: '#6a6a6a'
	}
}))

const InfoBox = styled(Paper)(({ theme }) => ({
	backgroundColor: '#333333',
	color: '#ffffff',
	padding: theme.spacing(2),
	marginBottom: theme.spacing(2),
	borderRadius: theme.spacing(1)
}))

function FaucetPage() {
	const [address, setAddress] = useState('')
	const [openSnackbar, setOpenSnackbar] = useState(false)
	const [snackbarMessage, setSnackbarMessage] = useState('')
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error'
	>('success')

	const handleClaim = async () => {
		try {
			const response = await fetch(
				'https://cancellation-reunion-ict-chapter.trycloudflare.com/faucet',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ address })
				}
			)

			const data = await response.json()

			if (response.ok) {
				setSnackbarMessage('0.5 Maal sent successfully!')
				setSnackbarSeverity('success')
			} else {
				setSnackbarMessage(data.error || 'An error occurred')
				setSnackbarSeverity('error')
			}

			setOpenSnackbar(true)
		} catch (error) {
			setSnackbarMessage(
				'An error occurred while processing your request'
			)
			setSnackbarSeverity('error')
			setOpenSnackbar(true)
		}
	}

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false)
	}

	return (
		<FuturisticContainer>
			<Typography
				variant="h3"
				gutterBottom
				style={{ color: '#8a8a8a', textAlign: 'center' }}
			>
				MAAL Faucet
			</Typography>
			<InfoBox>
				<Typography variant="body1">
					<strong>Claim Limits:</strong> You can claim 0.5 Maal every
					24 hours per wallet and IP address. Please do not use a VPN.
				</Typography>
			</InfoBox>
			<Box
				component="form"
				sx={{
					'& > :not(style)': { m: 1, width: '25ch' }
				}}
				noValidate
				autoComplete="off"
			>
				<FuturisticTextField
					label="Wallet Address"
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					variant="outlined"
					fullWidth
				/>
				<FuturisticButton variant="contained" onClick={handleClaim}>
					Claim Tokens
				</FuturisticButton>
			</Box>
			<Snackbar
				open={openSnackbar}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbarSeverity}
					sx={{ width: '100%' }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</FuturisticContainer>
	)
}

export default FaucetPage
