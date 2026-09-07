export interface HospitalProfile {
	license_number: string;
	description: string;
}

export interface IUpdateHospitalProfile {
	hospital_name?: string;
	hospital_address?: string;
	hospital_phone?: string;

	license_number?: string;
	description?: string;
}
