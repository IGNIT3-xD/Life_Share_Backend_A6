import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { EmergencyServiceController } from "./service.controller";
import { ServiceValidation } from "./service.validation";
import { upload } from "../../lib/multer";

const serviceRouter = Router();

serviceRouter.post(
	"/create-service",
	auth(Role.HOSPITAL),
	upload.single("service_image"),
	validateRequest(ServiceValidation.createServiceValidate),
	EmergencyServiceController.createServiceController,
);

serviceRouter.get("/", EmergencyServiceController.getAllServiceController);

serviceRouter.get(
	"/admin",
	auth(Role.SUPER_ADMIN, Role.ADMIN),
	EmergencyServiceController.getAllServiceAdminController,
);

serviceRouter.get(
	"/my-services",
	auth(Role.HOSPITAL),
	EmergencyServiceController.getMyServicesController,
);

serviceRouter.get(
	"/:id",
	EmergencyServiceController.getServiceDetailsController,
);

serviceRouter.patch(
	"/update-service/:id",
	auth(Role.HOSPITAL),
	upload.single("service_image"),
	validateRequest(ServiceValidation.updateServiceValidate),
	EmergencyServiceController.updateMyServicesController,
);

serviceRouter.put(
	"/update-service-status/:id",
	auth(Role.ADMIN, Role.SUPER_ADMIN),
	EmergencyServiceController.updateServiceStatusController,
);

serviceRouter.delete(
	"/my-service/:id",
	auth(Role.HOSPITAL, Role.SUPER_ADMIN),
	EmergencyServiceController.deleteMyServicesController,
);

export default serviceRouter;
