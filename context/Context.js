import React, { useState, useMemo, useContext, useCallback, useEffect } from 'react'
import { onAuth } from '../firebase/utils'

const UserContext = React.createContext()

export function UserProvider ({ children }) {

	const [user, setUser] = useState(undefined)
	const [userDB, setUserDB] = useState('')
	const [pdfData, setPdfData] = useState({tarifa: [''], otrosGastos: ['']})
	const [specificData, setSpecificData] = useState(null)
	const [specificDataEditable, setSpecificDataEditable] = useState(null)
	const [success, setSuccess] = useState(null)


	const setUserProfile = useCallback((userProfile) => {
		setUser(userProfile)
	}, [])
	const setUserData = useCallback((userDatabase) => {
		setUserDB((prev) => (
			typeof userDatabase === 'function' ? userDatabase(prev) : userDatabase
		))
	}, [])
	const setUserPdfData = useCallback((data) => {
		setPdfData((prev) => (
			typeof data === 'function' ? data(prev) : data
		))
	}, [])
	const setUserSpecificData = useCallback((userSpecificData) => {
		setSpecificData(userSpecificData)
	}, [])
	const setUserSpecificDataEditable = useCallback((userSpecificDataEditable) => {
		setSpecificDataEditable(userSpecificDataEditable)
	}, [])
	const setUserSuccess = useCallback((mode) => {
		setSuccess(mode)
		setTimeout(()=>{ setSuccess(null)}, 4000)
	}, [])

	useEffect(() => {
		const unsubscribe = onAuth(setUserProfile, setUserData)
		return unsubscribe
	}, [setUserData, setUserProfile])

	const value = useMemo(()=>{
		return ({
			user,
			userDB,
			pdfData,
			specificData,
			specificDataEditable,
			success,
			setUserProfile,
			setUserData,
			setUserPdfData,
			setUserSpecificData,
			setUserSpecificDataEditable,
			setUserSuccess,
		})
	}, [ user, userDB, pdfData, success, specificData, specificDataEditable ])

	return (
		<UserContext.Provider value={value} >
			{ children }
		</UserContext.Provider>
	)
} 

export function useUser () {
	const context = useContext(UserContext)
	if(!context){
		throw new Error('error')
	}
	return context
}
