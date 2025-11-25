'use client'

import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function ResetPasswordPage() {
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [showDialog, setShowDialog] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		if (password !== confirmPassword) {
			setError('Las contraseñas no coinciden')
			return
		}

		if (password.length < 8) {
			setError('La contraseña debe tener al menos 8 caracteres')
			return
		}

		setShowDialog(true)
	}

	const handleConfirm = async () => {
		setShowDialog(false)
		setIsLoading(true)

		// Aquí va tu lógica para actualizar la contraseña
		// const response = await fetch('/api/reset-password', {
		//   method: 'POST',
		//   body: JSON.stringify({ password })
		// })

		await new Promise(resolve => setTimeout(resolve, 1000))
		setIsLoading(false)

	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-sm space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-2xl font-bold">Restablecer contraseña</h1>
					<p className="text-sm text-muted-foreground">
						Por favor, ingresa tu nueva contraseña. Debe tener al menos 8 caracteres
						y asegúrate de que ambos campos coincidan.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="password">Nueva contraseña</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirmar contraseña</Label>
						<Input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>

					{error && (
						<p className="text-sm text-red-500">{error}</p>
					)}

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? 'Guardando...' : 'Guardar'}
					</Button>
				</form>

				<AlertDialog open={showDialog} onOpenChange={setShowDialog}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
							<AlertDialogDescription>
								¿Deseas cambiar tu contraseña? Esta acción no se puede deshacer.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>No</AlertDialogCancel>
							<AlertDialogAction onClick={handleConfirm}>Sí</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	)
}
