import { prisma } from "../../lib/prisma";

const getAnalytics = async () => {
	const [
		totalUsers,
		totalBlockedUsers,
		totalRevenue,
		totalRefunded,
		totalDonors,
		verifiedDonors,
		inProgressDonors,
		notEligibleDonors,
		totalRequesters,
		pendingRequesters,
		verifiedRequesters,
		rejectedRequesters,
		totalHospitals,
		inProgressHospitals,
		verifiedHospitals,
		activeEmergencyServices,
		inProgressEmergencyServices,
		inactiveEmergencyServices,
	] = await prisma.$transaction([
		prisma.user.count(),
		prisma.user.count({ where: { is_blocked: true } }),
		prisma.payment.aggregate({
			where: { payment_status: "PAID" },
			_sum: { payment_amount: true },
		}),
		prisma.payment.aggregate({
			where: { payment_status: "REFUNDED" },
			_sum: { refund_amount: true },
		}),
		prisma.donor.count(),
		prisma.donor.count({ where: { donorStatus: "VERIFIED" } }),
		prisma.donor.count({ where: { donorStatus: "IN_PROGRESS" } }),
		prisma.donor.count({ where: { donorStatus: "NOT_ELIGIBLE" } }),
		prisma.requester.count(),
		prisma.requester.count({ where: { verificationStatus: "PENDING" } }),
		prisma.requester.count({ where: { verificationStatus: "VERIFIED" } }),
		prisma.requester.count({ where: { verificationStatus: "REJECTED" } }),
		prisma.hospital.count(),
		prisma.hospital.count({ where: { hospital_status: "IN_PROGRESS" } }),
		prisma.hospital.count({ where: { hospital_status: "VERIFIED" } }),
		prisma.emergencyService.count({ where: { service_status: "ACTIVE" } }),
		prisma.emergencyService.count({ where: { service_status: "IN_PROGRESS" } }),
		prisma.emergencyService.count({ where: { service_status: "INACTIVE" } }),
	]);

	return {
		totalUsers,
		totalBlockedUsers,
		totalRevenue: totalRevenue._sum.payment_amount ?? 0,
		totalRefunded: totalRefunded._sum.refund_amount ?? 0,
		donors: {
			total: totalDonors,
			verified: verifiedDonors,
			inProgress: inProgressDonors,
			notEligible: notEligibleDonors,
		},
		requesters: {
			total: totalRequesters,
			pending: pendingRequesters,
			verified: verifiedRequesters,
			rejected: rejectedRequesters,
		},
		hospitals: {
			total: totalHospitals,
			inProgress: inProgressHospitals,
			verified: verifiedHospitals,
		},
		emergencyServices: {
			active: activeEmergencyServices,
			inProgress: inProgressEmergencyServices,
			inactive: inactiveEmergencyServices,
		},
	};
};

export const AnalyticsServices = { getAnalytics };
