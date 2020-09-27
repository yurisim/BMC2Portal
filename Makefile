frontend-dev:
	@echo !!
	@echo !! MAKE FRONTEND-DEV
	@echo !!
	@echo !! Building bmc2portal for STANDALONE development.
	@echo !!
	@echo !! Any requests that pull data from the database are mocked on the FRONTEND and are self-contained for 
	@echo !! STANDALONE local FRONTEND DEVELOPMENT and test.
	@echo !!
	${MAKE} -C ./bmc2portal bmc2portal_start_fedev

list:
	@echo -e frontend-dev \t\t Build bmc2portal for STANDALONE development
	@echo -e server-mock \t\t Build bmc2portal/server for frontend integration -- no DB
	@echo -e frontend-deploy\t\t Builds bmc2portal for deployment-production

frontend-deploy:
	@echo !!
	@echo !! MAKE FRONTEND-DEPLOY 
	@echo !!
	@echo !! Building bmc2portal STANDALONE packaged for production.
	@echo !!
	${MAKE} -C ./bmc2portal bmc2portal_build

server-mock:
	@echo !!
	@echo !! BULDING SERVER-MOCK 
	@echo !!
	@echo !! Building bmc2server and bmc2portal for MOCKED SERVER INTEGRATION.
	@echo !!
	@echo !! Any requests that pull data from the database are mocked on the SERVER and are contained in this
	@echo !! subsystem for FRONTEND/SERVER local INTEGRATION and test.
	@echo !!
	${MAKE} -j2 _server-dev _frontend-smock

_server-dev:
	${MAKE} -C ./bmc2server/src bmc2server_start_smock

_frontend-smock:
	${MAKE} -C ./bmc2portal bmc2portal_start_smock
