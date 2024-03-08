import React, { useState } from "react"
import * as RemixIcons from "react-icons/ri"
import * as Spinners from 'react-loader-spinner'
import toast from "react-hot-toast"
import HeaderMain from "../../../components/HeaderMain"
import { Organization } from "../../../services/organizationService"
import { useNavigate } from "react-router-dom"
import PleaseNote from "../../../components/PleaseNote"
import { StatusOption } from "../../../data/optionFilter"
import useHandleError from "../../../hooks/useHandleError"

const CreateOrganization = () => {
	const Navigate = useNavigate()
	const statusOption = StatusOption()
	const [file, setFile] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	// ORGANIZATION OWNERSHIP
	const [organization, setOrganization] = useState({
		name: "",
		description: "",
		phone: "",
		city: "",
		neighborhood: "",
		idStatus: ""
	})

	// SET ALL VALUE
	const handleAdd = (e) => {
		const { name, value } = e.target;
		setOrganization({
			...organization,
			[name]: value,
		})
	}

	// CHOISE PICTURE
	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0]
		setFile(selectedFile)
	}

	// ADD ORGANIZATION
	const handleSubmit = (e) => {
		e.preventDefault()
		// setIsSubmitting(true)
		if (
			organization.name === "" ||
			organization.description === "" ||
			organization.phone === "" ||
			organization.city === "" ||
			organization.neighborhood === "" ||
			organization.idStatus === ""
		) {
			setIsSubmitting(false)
			toast.error("Les champs marqués par une etoile sont obligations !")
		}
		else {
			const formData = new FormData()
			Object.keys(organization).forEach((key) => {
				formData.append(key, organization[key])
			})
			if (file) {
				formData.append('picture', file)
			}
			Organization.add(formData)
				.then((res) => {
					toast.success("organization ajoutée avec succès !")
					Navigate('/organizations/')
				})
				.catch((err) => {
					console.log("err", err);
					useHandleError(err, Navigate)
				})
				.finally(() => {
					setIsSubmitting(false)
				})
		}
	}

	return (
		<>
			<div>
				<HeaderMain />

				<div className="card-body CardBody card">
					<h5>Entrez les informations concernant votre organisation.</h5>
					<PleaseNote />
					<blockquote className="blockquote mb-0">
						<form onSubmit={handleSubmit} className="row g-2 form">
							<div className="col-md-6">
								<label htmlFor="name" className="form-label">
									Nom de l'organisation :
									<span className="text-danger taille_etoile">*</span>
								</label>
								<input
									type="text"
									className="form-control no-focus-outline"
									id="name"
									name="name"
									value={organization.name}
									onChange={handleAdd}
									autoComplete='off'
									required
								/>
							</div>
							<div className="col-md-6">
								<label htmlFor="phone" className="form-label">
									Téléphone :
									<span className="text-danger taille_etoile">*</span>
								</label>
								<input
									type="number"
									className="form-control no-focus-outline"
									id="phone"
									name="phone"
									value={organization.phone}
									onChange={handleAdd}
									autoComplete='off'
									required
								/>
							</div>
							<div className="col-md-12">
								<label htmlFor="num_imma" className="form-label">
									Description :
									<span className="text-danger taille_etoile">*</span>
								</label>
								<textarea className="form-control no-focus-outline"
									cols="10"
									rows="5"
									id="description"
									name="description"
									value={organization.description}
									onChange={handleAdd}
									autoComplete='off'
									required
								>
								</textarea>
							</div>

							<div className="col-md-6">
								<label htmlFor="city" className="form-label">
									Ville :
									<span className="text-danger taille_etoile">*</span>
								</label>
								<input
									type="text"
									className="form-control no-focus-outline"
									id="city"
									name="city"
									value={organization.city}
									onChange={handleAdd}
									autoComplete='off'
									required
								/>
							</div>

							<div className="col-md-6 ">
								<label htmlFor="idStatus" className="form-label">
									Status :
									<span className="text-danger taille_etoile">*</span>
								</label>
								<select className="form-control no-focus-outline p-2" name="idStatus" id="idStatus" value={organization.idStatus} required
									onChange={handleAdd}
									autoComplete='off'>
									{statusOption.map((item) => (
										<option key={item.value} value={item.value}>{item.label}</option>
									))}
								</select>
							</div>

							<div className="col-md-6 ">
								<label htmlFor="neighborhood" className="form-label">
									Quartier :
									<span className="text-danger taille_etoile">*</span>
								</label>
								<input
									type="text"
									className="form-control no-focus-outline"
									id="neighborhood"
									name="neighborhood"
									value={organization.neighborhood}
									onChange={handleAdd}
									autoComplete='off'
									required
								/>
							</div>

							<div className="col-md-6 ">
								<label htmlFor="picture" className="form-label">Logo :</label>
								<input
									type="file"
									className="form-control no-focus-outline"
									id="picture"
									name="picture"
									onChange={handleFileChange}
								/>
							</div>

							<div className="col-md-12 d-flex gap-2">
								<button type="submit" className="Btn Send btn-sm" disabled={isSubmitting}>
									{/* {isSubmitting ? <Spinners.TailSpin height="18" width="18" ariaLabel="tail-spin-loading" radius="5" color="#fff" /> : <RemixIcons.RiSendPlaneLine />}

									{isSubmitting ? 'Ajout en cours' : 'Ajouter'} */}
									Ajouter
								</button>
							</div>
						</form>
					</blockquote>
				</div>
			</div>
		</>
	)
}

export default CreateOrganization