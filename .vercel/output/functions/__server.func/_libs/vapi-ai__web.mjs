import { a as __toCommonJS, i as __require, t as __commonJSMin } from "../_runtime.mjs";
import { n as init_daily_esm, t as daily_esm_exports } from "./daily-co__daily-js.mjs";
//#region node_modules/@vapi-ai/web/dist/api.js
var require_api = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Api = exports.HttpClient = exports.ContentType = void 0;
	var ContentType;
	(function(ContentType) {
		ContentType["Json"] = "application/json";
		ContentType["JsonApi"] = "application/vnd.api+json";
		ContentType["FormData"] = "multipart/form-data";
		ContentType["UrlEncoded"] = "application/x-www-form-urlencoded";
		ContentType["Text"] = "text/plain";
	})(ContentType || (exports.ContentType = ContentType = {}));
	var HttpClient = class {
		baseUrl = "https://api.vapi.ai";
		securityData = null;
		securityWorker;
		abortControllers = /* @__PURE__ */ new Map();
		customFetch = (...fetchParams) => fetch(...fetchParams);
		baseApiParams = {
			credentials: "same-origin",
			headers: {},
			redirect: "follow",
			referrerPolicy: "no-referrer"
		};
		constructor(apiConfig = {}) {
			Object.assign(this, apiConfig);
		}
		setSecurityData = (data) => {
			this.securityData = data;
		};
		encodeQueryParam(key, value) {
			return `${encodeURIComponent(key)}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
		}
		addQueryParam(query, key) {
			return this.encodeQueryParam(key, query[key]);
		}
		addArrayQueryParam(query, key) {
			return query[key].map((v) => this.encodeQueryParam(key, v)).join("&");
		}
		toQueryString(rawQuery) {
			const query = rawQuery || {};
			return Object.keys(query).filter((key) => "undefined" !== typeof query[key]).map((key) => Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)).join("&");
		}
		addQueryParams(rawQuery) {
			const queryString = this.toQueryString(rawQuery);
			return queryString ? `?${queryString}` : "";
		}
		contentFormatters = {
			[ContentType.Json]: (input) => input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
			[ContentType.JsonApi]: (input) => input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
			[ContentType.Text]: (input) => input !== null && typeof input !== "string" ? JSON.stringify(input) : input,
			[ContentType.FormData]: (input) => {
				if (input instanceof FormData) return input;
				return Object.keys(input || {}).reduce((formData, key) => {
					const property = input[key];
					formData.append(key, property instanceof Blob ? property : typeof property === "object" && property !== null ? JSON.stringify(property) : `${property}`);
					return formData;
				}, new FormData());
			},
			[ContentType.UrlEncoded]: (input) => this.toQueryString(input)
		};
		mergeRequestParams(params1, params2) {
			return {
				...this.baseApiParams,
				...params1,
				...params2 || {},
				headers: {
					...this.baseApiParams.headers || {},
					...params1.headers || {},
					...params2 && params2.headers || {}
				}
			};
		}
		createAbortSignal = (cancelToken) => {
			if (this.abortControllers.has(cancelToken)) {
				const abortController = this.abortControllers.get(cancelToken);
				if (abortController) return abortController.signal;
				return;
			}
			const abortController = new AbortController();
			this.abortControllers.set(cancelToken, abortController);
			return abortController.signal;
		};
		abortRequest = (cancelToken) => {
			const abortController = this.abortControllers.get(cancelToken);
			if (abortController) {
				abortController.abort();
				this.abortControllers.delete(cancelToken);
			}
		};
		request = async ({ body, secure, path, type, query, format, baseUrl, cancelToken, ...params }) => {
			const secureParams = (typeof secure === "boolean" ? secure : this.baseApiParams.secure) && this.securityWorker && await this.securityWorker(this.securityData) || {};
			const requestParams = this.mergeRequestParams(params, secureParams);
			const queryString = query && this.toQueryString(query);
			const payloadFormatter = this.contentFormatters[type || ContentType.Json];
			const responseFormat = format || requestParams.format;
			return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
				...requestParams,
				headers: {
					...requestParams.headers || {},
					...type && type !== ContentType.FormData ? { "Content-Type": type } : {}
				},
				signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
				body: typeof body === "undefined" || body === null ? null : payloadFormatter(body)
			}).then(async (response) => {
				const r = response;
				r.data = null;
				r.error = null;
				const responseToParse = responseFormat ? response.clone() : response;
				const data = !responseFormat ? r : await responseToParse[responseFormat]().then((data) => {
					if (r.ok) r.data = data;
					else r.error = data;
					return r;
				}).catch((e) => {
					r.error = e;
					return r;
				});
				if (cancelToken) this.abortControllers.delete(cancelToken);
				if (!response.ok) throw data;
				return data;
			});
		};
	};
	exports.HttpClient = HttpClient;
	/**
	* @title Vapi API
	* @version 1.0
	* @baseUrl https://api.vapi.ai
	* @contact
	*
	* Voice AI for developers.
	*/
	var Api = class extends HttpClient {
		assistant = {
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerCreate
			* @summary Create Assistant
			* @request POST:/assistant
			* @secure
			*/
			assistantControllerCreate: (data, params = {}) => this.request({
				path: `/assistant`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerFindAll
			* @summary List Assistants
			* @request GET:/assistant
			* @secure
			*/
			assistantControllerFindAll: (query, params = {}) => this.request({
				path: `/assistant`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerValidateBackgroundSoundUrl
			* @summary Validate Background Sound URL
			* @request POST:/assistant/background-sound/validate
			* @secure
			*/
			assistantControllerValidateBackgroundSoundUrl: (data, params = {}) => this.request({
				path: `/assistant/background-sound/validate`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerFindAllOrgDrafts
			* @summary List All Assistant Drafts
			* @request GET:/assistant/draft
			* @secure
			*/
			assistantControllerFindAllOrgDrafts: (query, params = {}) => this.request({
				path: `/assistant/draft`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerFindOne
			* @summary Get Assistant
			* @request GET:/assistant/{id}
			* @secure
			*/
			assistantControllerFindOne: (id, params = {}) => this.request({
				path: `/assistant/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerUpdate
			* @summary Update Assistant
			* @request PATCH:/assistant/{id}
			* @secure
			*/
			assistantControllerUpdate: (id, data, params = {}) => this.request({
				path: `/assistant/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerReplace
			* @summary Replace Assistant
			* @request PUT:/assistant/{id}
			* @secure
			*/
			assistantControllerReplace: (id, data, params = {}) => this.request({
				path: `/assistant/${id}`,
				method: "PUT",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerRemove
			* @summary Delete Assistant
			* @request DELETE:/assistant/{id}
			* @secure
			*/
			assistantControllerRemove: (id, params = {}) => this.request({
				path: `/assistant/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* @description Deprecated. Use `GET /assistant/:id/versions` instead.
			*
			* @tags Assistants
			* @name AssistantControllerFindVersions
			* @summary List Legacy Assistant Versions
			* @request GET:/assistant/{id}/version
			* @deprecated
			* @secure
			*/
			assistantControllerFindVersions: (id, query, params = {}) => this.request({
				path: `/assistant/${id}/version`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* @description Returns the version history for the assistant.
			*
			* @tags Assistants
			* @name AssistantControllerFindAllVersions
			* @summary List Assistant Versions
			* @request GET:/assistant/{id}/versions
			* @secure
			*/
			assistantControllerFindAllVersions: (id, query, params = {}) => this.request({
				path: `/assistant/${id}/versions`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerFindOneVersion
			* @summary Get Assistant Version
			* @request GET:/assistant/{id}/versions/{version}
			* @secure
			*/
			assistantControllerFindOneVersion: (id, version, query, params = {}) => this.request({
				path: `/assistant/${id}/versions/${version}`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerAssistantVersionMetadataUpdate
			* @summary Update Assistant Version Metadata
			* @request PATCH:/assistant/{id}/versions/{version}
			* @secure
			*/
			assistantControllerAssistantVersionMetadataUpdate: (id, version, data, params = {}) => this.request({
				path: `/assistant/${id}/versions/${version}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerSoftDeleteVersion
			* @summary Delete Assistant Version
			* @request DELETE:/assistant/{id}/versions/{version}
			* @secure
			*/
			assistantControllerSoftDeleteVersion: (id, version, query, params = {}) => this.request({
				path: `/assistant/${id}/versions/${version}`,
				method: "DELETE",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* @description Restores the assistant to the selected version.
			*
			* @tags Assistants
			* @name AssistantControllerRestoreVersion
			* @summary Restore Assistant Version
			* @request POST:/assistant/{id}/restore/{version}
			* @secure
			*/
			assistantControllerRestoreVersion: (id, version, params = {}) => this.request({
				path: `/assistant/${id}/restore/${version}`,
				method: "POST",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerFindAllDrafts
			* @summary List Assistant Drafts
			* @request GET:/assistant/{id}/draft
			* @secure
			*/
			assistantControllerFindAllDrafts: (id, query, params = {}) => this.request({
				path: `/assistant/${id}/draft`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerCreateDraft
			* @summary Create Assistant Draft
			* @request POST:/assistant/{id}/draft
			* @secure
			*/
			assistantControllerCreateDraft: (id, data, params = {}) => this.request({
				path: `/assistant/${id}/draft`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerUpsertDraft
			* @summary Upsert Assistant Draft
			* @request PUT:/assistant/{id}/draft
			* @secure
			*/
			assistantControllerUpsertDraft: (id, data, params = {}) => this.request({
				path: `/assistant/${id}/draft`,
				method: "PUT",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerFindOneDraft
			* @summary Get Assistant Draft
			* @request GET:/assistant/{id}/draft/{draftId}
			* @secure
			*/
			assistantControllerFindOneDraft: (id, draftId, params = {}) => this.request({
				path: `/assistant/${id}/draft/${draftId}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerUpdateDraft
			* @summary Update Assistant Draft
			* @request PATCH:/assistant/{id}/draft/{draftId}
			* @secure
			*/
			assistantControllerUpdateDraft: (id, draftId, data, params = {}) => this.request({
				path: `/assistant/${id}/draft/${draftId}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerDeleteDraft
			* @summary Delete Assistant Draft
			* @request DELETE:/assistant/{id}/draft/{draftId}
			* @secure
			*/
			assistantControllerDeleteDraft: (id, draftId, params = {}) => this.request({
				path: `/assistant/${id}/draft/${draftId}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		v2 = {
			/**
			* No description
			*
			* @tags Assistants
			* @name AssistantControllerFindAllPaginated
			* @summary List Assistants with pagination
			* @request GET:/v2/assistant
			* @secure
			*/
			assistantControllerFindAllPaginated: (query, params = {}) => this.request({
				path: `/v2/assistant`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallControllerCallsExport
			* @summary Export Calls to CSV
			* @request GET:/v2/call/export
			* @secure
			*/
			callControllerCallsExport: (query, params = {}) => this.request({
				path: `/v2/call/export`,
				method: "GET",
				query,
				secure: true,
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallControllerFindAllPaginated
			* @summary List Calls
			* @request GET:/v2/call
			* @secure
			*/
			callControllerFindAllPaginated: (query, params = {}) => this.request({
				path: `/v2/call`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallControllerFindAllMetadataPaginated
			* @summary List Call Metadata
			* @request GET:/v2/call/metadata
			* @secure
			*/
			callControllerFindAllMetadataPaginated: (query, params = {}) => this.request({
				path: `/v2/call/metadata`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Campaigns
			* @name CampaignControllerCreateV2
			* @summary Create Campaign V2
			* @request POST:/v2/campaign
			* @secure
			*/
			campaignControllerCreateV2: (data, params = {}) => this.request({
				path: `/v2/campaign`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Campaigns
			* @name CampaignControllerFindAllV2
			* @summary List Campaigns V2
			* @request GET:/v2/campaign
			* @secure
			*/
			campaignControllerFindAllV2: (query, params = {}) => this.request({
				path: `/v2/campaign`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Campaigns
			* @name CampaignControllerFindOneV2
			* @summary Get Campaign V2
			* @request GET:/v2/campaign/{id}
			* @secure
			*/
			campaignControllerFindOneV2: (id, query, params = {}) => this.request({
				path: `/v2/campaign/${id}`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Campaigns
			* @name CampaignControllerUpdateV2
			* @summary Update Campaign
			* @request PATCH:/v2/campaign/{id}
			* @secure
			*/
			campaignControllerUpdateV2: (id, data, params = {}) => this.request({
				path: `/v2/campaign/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Campaigns
			* @name CampaignControllerRemoveV2
			* @summary Delete Campaign
			* @request DELETE:/v2/campaign/{id}
			* @secure
			*/
			campaignControllerRemoveV2: (id, params = {}) => this.request({
				path: `/v2/campaign/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Campaigns
			* @name CampaignControllerGetCampaignV2Contacts
			* @summary Get Campaign V2 Contacts
			* @request GET:/v2/campaign/{id}/contacts
			* @secure
			*/
			campaignControllerGetCampaignV2Contacts: (id, query, params = {}) => this.request({
				path: `/v2/campaign/${id}/contacts`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Phone Numbers
			* @name PhoneNumberControllerFindAllPaginated
			* @summary List Phone Numbers
			* @request GET:/v2/phone-number
			* @secure
			*/
			phoneNumberControllerFindAllPaginated: (query, params = {}) => this.request({
				path: `/v2/phone-number`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Files
			* @name FileV2ControllerFindAllPaginated
			* @summary List Files with pagination
			* @request GET:/v2/file
			* @secure
			*/
			fileV2ControllerFindAllPaginated: (query, params = {}) => this.request({
				path: `/v2/file`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Knowledge Bases V2
			* @name KnowledgeBaseV2ControllerCreate
			* @summary Create a Knowledge Base V2
			* @request POST:/v2/knowledge-base
			* @secure
			*/
			knowledgeBaseV2ControllerCreate: (data, params = {}) => this.request({
				path: `/v2/knowledge-base`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Knowledge Bases V2
			* @name KnowledgeBaseV2ControllerFindAll
			* @summary List Knowledge Bases V2
			* @request GET:/v2/knowledge-base
			* @secure
			*/
			knowledgeBaseV2ControllerFindAll: (query, params = {}) => this.request({
				path: `/v2/knowledge-base`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Knowledge Bases V2
			* @name KnowledgeBaseV2ControllerFilesGet
			* @summary List files in a Knowledge Base V2
			* @request GET:/v2/knowledge-base/{id}/file
			* @secure
			*/
			knowledgeBaseV2ControllerFilesGet: (id, params = {}) => this.request({
				path: `/v2/knowledge-base/${id}/file`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Knowledge Bases V2
			* @name KnowledgeBaseV2ControllerFileAttach
			* @summary Attach and ingest a file
			* @request POST:/v2/knowledge-base/{id}/file
			* @secure
			*/
			knowledgeBaseV2ControllerFileAttach: (id, data, params = {}) => this.request({
				path: `/v2/knowledge-base/${id}/file`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Knowledge Bases V2
			* @name KnowledgeBaseV2ControllerFileDetach
			* @summary Detach a file
			* @request DELETE:/v2/knowledge-base/{id}/file/{fileId}
			* @secure
			*/
			knowledgeBaseV2ControllerFileDetach: (id, fileId, params = {}) => this.request({
				path: `/v2/knowledge-base/${id}/file/${fileId}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Knowledge Bases V2
			* @name KnowledgeBaseV2ControllerFileRetry
			* @summary Retry indexing a failed file
			* @request POST:/v2/knowledge-base/{id}/file/{fileId}/retry
			* @secure
			*/
			knowledgeBaseV2ControllerFileRetry: (id, fileId, params = {}) => this.request({
				path: `/v2/knowledge-base/${id}/file/${fileId}/retry`,
				method: "POST",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Knowledge Bases V2
			* @name KnowledgeBaseV2ControllerUpdate
			* @summary Update a Knowledge Base V2
			* @request PATCH:/v2/knowledge-base/{id}
			* @secure
			*/
			knowledgeBaseV2ControllerUpdate: (id, data, params = {}) => this.request({
				path: `/v2/knowledge-base/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Knowledge Bases V2
			* @name KnowledgeBaseV2ControllerFindOne
			* @summary Get a Knowledge Base V2
			* @request GET:/v2/knowledge-base/{id}
			* @secure
			*/
			knowledgeBaseV2ControllerFindOne: (id, params = {}) => this.request({
				path: `/v2/knowledge-base/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Knowledge Bases V2
			* @name KnowledgeBaseV2ControllerRemove
			* @summary Delete a Knowledge Base V2
			* @request DELETE:/v2/knowledge-base/{id}
			* @secure
			*/
			knowledgeBaseV2ControllerRemove: (id, params = {}) => this.request({
				path: `/v2/knowledge-base/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		squad = {
			/**
			* No description
			*
			* @tags Squads
			* @name SquadControllerCreate
			* @summary Create Squad
			* @request POST:/squad
			* @secure
			*/
			squadControllerCreate: (data, params = {}) => this.request({
				path: `/squad`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Squads
			* @name SquadControllerFindAll
			* @summary List Squads
			* @request GET:/squad
			* @secure
			*/
			squadControllerFindAll: (query, params = {}) => this.request({
				path: `/squad`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Squads
			* @name SquadControllerFindOne
			* @summary Get Squad
			* @request GET:/squad/{id}
			* @secure
			*/
			squadControllerFindOne: (id, params = {}) => this.request({
				path: `/squad/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Squads
			* @name SquadControllerUpdate
			* @summary Update Squad
			* @request PATCH:/squad/{id}
			* @secure
			*/
			squadControllerUpdate: (id, data, params = {}) => this.request({
				path: `/squad/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Squads
			* @name SquadControllerRemove
			* @summary Delete Squad
			* @request DELETE:/squad/{id}
			* @secure
			*/
			squadControllerRemove: (id, params = {}) => this.request({
				path: `/squad/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* @description Returns the version history for the squad.
			*
			* @tags Squads
			* @name SquadControllerFindAllVersions
			* @summary List Squad Versions
			* @request GET:/squad/{id}/versions
			* @secure
			*/
			squadControllerFindAllVersions: (id, query, params = {}) => this.request({
				path: `/squad/${id}/versions`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Squads
			* @name SquadControllerFindOneVersion
			* @summary Get Squad Version
			* @request GET:/squad/{id}/versions/{version}
			* @secure
			*/
			squadControllerFindOneVersion: (id, version, query, params = {}) => this.request({
				path: `/squad/${id}/versions/${version}`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* @description Deletes the selected version and rolls the squad back to the highest remaining live version. Deleting a version that is already deleted returns 200 with that version.
			*
			* @tags Squads
			* @name SquadControllerSoftDeleteVersion
			* @summary Delete Squad Version
			* @request DELETE:/squad/{id}/versions/{version}
			* @secure
			*/
			squadControllerSoftDeleteVersion: (id, version, params = {}) => this.request({
				path: `/squad/${id}/versions/${version}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		workflow = {
			/**
			* No description
			*
			* @tags Workflow
			* @name WorkflowControllerFindAll
			* @summary Get Workflows
			* @request GET:/workflow
			* @secure
			*/
			workflowControllerFindAll: (params = {}) => this.request({
				path: `/workflow`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Workflow
			* @name WorkflowControllerCreate
			* @summary Create Workflow
			* @request POST:/workflow
			* @secure
			*/
			workflowControllerCreate: (data, params = {}) => this.request({
				path: `/workflow`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Workflow
			* @name WorkflowControllerFindOne
			* @summary Get Workflow
			* @request GET:/workflow/{id}
			* @secure
			*/
			workflowControllerFindOne: (id, params = {}) => this.request({
				path: `/workflow/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Workflow
			* @name WorkflowControllerDelete
			* @summary Delete Workflow
			* @request DELETE:/workflow/{id}
			* @secure
			*/
			workflowControllerDelete: (id, params = {}) => this.request({
				path: `/workflow/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Workflow
			* @name WorkflowControllerUpdate
			* @summary Update Workflow
			* @request PATCH:/workflow/{id}
			* @secure
			*/
			workflowControllerUpdate: (id, data, params = {}) => this.request({
				path: `/workflow/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			})
		};
		call = {
			/**
			* No description
			*
			* @tags Calls
			* @name CallControllerCreate
			* @summary Create Call
			* @request POST:/call
			* @secure
			*/
			callControllerCreate: (data, params = {}) => this.request({
				path: `/call`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallControllerFindAll
			* @summary List Calls
			* @request GET:/call
			* @secure
			*/
			callControllerFindAll: (query, params = {}) => this.request({
				path: `/call`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallControllerFindOne
			* @summary Get Call
			* @request GET:/call/{id}
			* @secure
			*/
			callControllerFindOne: (id, params = {}) => this.request({
				path: `/call/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallControllerUpdate
			* @summary Update Call
			* @request PATCH:/call/{id}
			* @secure
			*/
			callControllerUpdate: (id, data, params = {}) => this.request({
				path: `/call/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallControllerDeleteCallData
			* @summary Delete Call
			* @request DELETE:/call/{id}
			* @secure
			*/
			callControllerDeleteCallData: (id, data, params = {}) => this.request({
				path: `/call/${id}`,
				method: "DELETE",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallControllerCreatePhoneCall
			* @summary Create Phone Call
			* @request POST:/call/phone
			* @deprecated
			* @secure
			*/
			callControllerCreatePhoneCall: (data, params = {}) => this.request({
				path: `/call/phone`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallControllerCreateWebCall
			* @summary Create Web Call
			* @request POST:/call/web
			* @secure
			*/
			callControllerCreateWebCall: (data, params = {}) => this.request({
				path: `/call/web`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallArtifactControllerMonoRecordingDownload
			* @summary Download Call Mono Recording
			* @request GET:/call/{id}/mono-recording
			* @secure
			*/
			callArtifactControllerMonoRecordingDownload: (id, params = {}) => this.request({
				path: `/call/${id}/mono-recording`,
				method: "GET",
				secure: true,
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallArtifactControllerStereoRecordingDownload
			* @summary Download Call Stereo Recording
			* @request GET:/call/{id}/stereo-recording
			* @secure
			*/
			callArtifactControllerStereoRecordingDownload: (id, params = {}) => this.request({
				path: `/call/${id}/stereo-recording`,
				method: "GET",
				secure: true,
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallArtifactControllerVideoRecordingDownload
			* @summary Download Call Video Recording
			* @request GET:/call/{id}/video-recording
			* @secure
			*/
			callArtifactControllerVideoRecordingDownload: (id, params = {}) => this.request({
				path: `/call/${id}/video-recording`,
				method: "GET",
				secure: true,
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallArtifactControllerCustomerRecordingDownload
			* @summary Download Call Customer Recording
			* @request GET:/call/{id}/customer-recording
			* @secure
			*/
			callArtifactControllerCustomerRecordingDownload: (id, params = {}) => this.request({
				path: `/call/${id}/customer-recording`,
				method: "GET",
				secure: true,
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallArtifactControllerAssistantRecordingDownload
			* @summary Download Call Assistant Recording
			* @request GET:/call/{id}/assistant-recording
			* @secure
			*/
			callArtifactControllerAssistantRecordingDownload: (id, params = {}) => this.request({
				path: `/call/${id}/assistant-recording`,
				method: "GET",
				secure: true,
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallArtifactControllerPcapDownload
			* @summary Download Call Packet Capture (pcap)
			* @request GET:/call/{id}/pcap
			* @secure
			*/
			callArtifactControllerPcapDownload: (id, params = {}) => this.request({
				path: `/call/${id}/pcap`,
				method: "GET",
				secure: true,
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name CallArtifactControllerCallLogsDownload
			* @summary Download Call Logs
			* @request GET:/call/{id}/call-logs
			* @secure
			*/
			callArtifactControllerCallLogsDownload: (id, params = {}) => this.request({
				path: `/call/${id}/call-logs`,
				method: "GET",
				secure: true,
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name GoalEvaluationCurrentControllerCurrentGet
			* @summary Get the current goal evaluation for a call
			* @request GET:/call/{id}/goal-evaluation
			* @secure
			*/
			goalEvaluationCurrentControllerCurrentGet: (id, query, params = {}) => this.request({
				path: `/call/${id}/goal-evaluation`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Calls
			* @name GoalEvaluationCurrentControllerCurrentBatchGet
			* @summary Get current goal evaluations for up to 100 call/goal pairs
			* @request POST:/call/goal-evaluation/batch
			* @secure
			*/
			goalEvaluationCurrentControllerCurrentBatchGet: (data, params = {}) => this.request({
				path: `/call/goal-evaluation/batch`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			})
		};
		chat = {
			/**
			* No description
			*
			* @tags Chats
			* @name ChatControllerListChats
			* @summary List Chats
			* @request GET:/chat
			* @secure
			*/
			chatControllerListChats: (query, params = {}) => this.request({
				path: `/chat`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* @description Creates a new chat with optional SMS delivery via transport field. Requires at least one of: assistantId/assistant, sessionId, or previousChatId. Note: sessionId and previousChatId are mutually exclusive. Transport field enables SMS delivery with two modes: (1) New conversation - provide transport.phoneNumberId and transport.customer to create a new session, (2) Existing conversation - provide sessionId to use existing session data. Cannot specify both sessionId and transport fields together. The transport.useLLMGeneratedMessageForOutbound flag controls whether input is processed by LLM (true, default) or forwarded directly as SMS (false).
			*
			* @tags Chats
			* @name ChatControllerCreateChat
			* @summary Create Chat
			* @request POST:/chat
			* @secure
			*/
			chatControllerCreateChat: (data, params = {}) => this.request({
				path: `/chat`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Chats
			* @name ChatControllerChatsExport
			* @summary Export Chats to CSV
			* @request GET:/chat/export
			* @secure
			*/
			chatControllerChatsExport: (query, params = {}) => this.request({
				path: `/chat/export`,
				method: "GET",
				query,
				secure: true,
				...params
			}),
			/**
			* No description
			*
			* @tags Chats
			* @name ChatControllerGetChat
			* @summary Get Chat
			* @request GET:/chat/{id}
			* @secure
			*/
			chatControllerGetChat: (id, params = {}) => this.request({
				path: `/chat/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Chats
			* @name ChatControllerDeleteChat
			* @summary Delete Chat
			* @request DELETE:/chat/{id}
			* @secure
			*/
			chatControllerDeleteChat: (id, params = {}) => this.request({
				path: `/chat/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Chats
			* @name ChatControllerCreateOpenAiChat
			* @summary Create Chat (OpenAI Compatible)
			* @request POST:/chat/responses
			* @secure
			*/
			chatControllerCreateOpenAiChat: (data, params = {}) => this.request({
				path: `/chat/responses`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Chats
			* @name ChatControllerCreateWebChat
			* @summary Create WebChat
			* @request POST:/chat/web
			* @secure
			*/
			chatControllerCreateWebChat: (data, params = {}) => this.request({
				path: `/chat/web`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Chats
			* @name ChatControllerCreateOpenAiWebChat
			* @summary Create WebChat (OpenAI Compatible)
			* @request POST:/chat/web/responses
			* @secure
			*/
			chatControllerCreateOpenAiWebChat: (data, params = {}) => this.request({
				path: `/chat/web/responses`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			})
		};
		campaign = {
			/**
			* No description
			*
			* @tags Campaigns
			* @name CampaignControllerCreate
			* @summary Create Campaign
			* @request POST:/campaign
			* @secure
			*/
			campaignControllerCreate: (data, params = {}) => this.request({
				path: `/campaign`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Campaigns
			* @name CampaignControllerFindAll
			* @summary List Campaigns
			* @request GET:/campaign
			* @secure
			*/
			campaignControllerFindAll: (query, params = {}) => this.request({
				path: `/campaign`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Campaigns
			* @name CampaignControllerFindOne
			* @summary Get Campaign
			* @request GET:/campaign/{id}
			* @secure
			*/
			campaignControllerFindOne: (id, params = {}) => this.request({
				path: `/campaign/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Campaigns
			* @name CampaignControllerUpdate
			* @summary Update Campaign
			* @request PATCH:/campaign/{id}
			* @secure
			*/
			campaignControllerUpdate: (id, data, params = {}) => this.request({
				path: `/campaign/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Campaigns
			* @name CampaignControllerRemove
			* @summary Delete Campaign
			* @request DELETE:/campaign/{id}
			* @secure
			*/
			campaignControllerRemove: (id, params = {}) => this.request({
				path: `/campaign/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		session = {
			/**
			* No description
			*
			* @tags Sessions
			* @name SessionControllerCreate
			* @summary Create Session
			* @request POST:/session
			* @secure
			*/
			sessionControllerCreate: (data, params = {}) => this.request({
				path: `/session`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Sessions
			* @name SessionControllerFindAllPaginated
			* @summary List Sessions
			* @request GET:/session
			* @secure
			*/
			sessionControllerFindAllPaginated: (query, params = {}) => this.request({
				path: `/session`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Sessions
			* @name SessionControllerSessionsExport
			* @summary Export Sessions to CSV
			* @request GET:/session/export
			* @secure
			*/
			sessionControllerSessionsExport: (query, params = {}) => this.request({
				path: `/session/export`,
				method: "GET",
				query,
				secure: true,
				...params
			}),
			/**
			* No description
			*
			* @tags Sessions
			* @name SessionControllerFindOne
			* @summary Get Session
			* @request GET:/session/{id}
			* @secure
			*/
			sessionControllerFindOne: (id, params = {}) => this.request({
				path: `/session/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Sessions
			* @name SessionControllerUpdate
			* @summary Update Session
			* @request PATCH:/session/{id}
			* @secure
			*/
			sessionControllerUpdate: (id, data, params = {}) => this.request({
				path: `/session/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Sessions
			* @name SessionControllerRemove
			* @summary Delete Session
			* @request DELETE:/session/{id}
			* @secure
			*/
			sessionControllerRemove: (id, params = {}) => this.request({
				path: `/session/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		trafficAllocations = {
			/**
			* @description Creates a new traffic allocation for an assistant, replacing the one currently in effect. To start or adjust a split, send targets naming published versions (such as "v7") with percentages totaling 100; allocationIntent is inferred as 'explicit'. To stop splitting and send every call to the newest published version, send allocationIntent 'follow-latest' with no targets field; stopping always names its intent, so a dropped targets field can never end a split by accident.
			*
			* @tags Traffic Allocations
			* @name TrafficAllocationControllerCreate
			* @summary Create traffic allocation
			* @request POST:/traffic-allocations
			* @secure
			*/
			trafficAllocationControllerCreate: (data, params = {}) => this.request({
				path: `/traffic-allocations`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* @description The append-only history of an assistant's allocations, newest first.
			*
			* @tags Traffic Allocations
			* @name TrafficAllocationControllerFindAllPaginated
			* @summary List traffic allocations
			* @request GET:/traffic-allocations
			* @secure
			*/
			trafficAllocationControllerFindAllPaginated: (query, params = {}) => this.request({
				path: `/traffic-allocations`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* @description The allocation currently in effect for the assistant, with its targets. The response carries no allocation field when traffic splitting has never been configured.
			*
			* @tags Traffic Allocations
			* @name TrafficAllocationControllerLatestGet
			* @summary Get latest traffic allocation
			* @request GET:/traffic-allocations/latest
			* @secure
			*/
			trafficAllocationControllerLatestGet: (query, params = {}) => this.request({
				path: `/traffic-allocations/latest`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* @description Per-assistant-version call metrics over a time window: call counts, configured vs actual traffic share, duration, cost per minute, latency, ended reasons, a bucketed timeseries, and optional structured output aggregations. Calls with no assistant version are reported as an 'unversioned' row.
			*
			* @tags Traffic Allocations
			* @name TrafficAllocationControllerMetricsGet
			* @summary Get traffic split metrics
			* @request GET:/traffic-allocations/metrics
			* @secure
			*/
			trafficAllocationControllerMetricsGet: (query, params = {}) => this.request({
				path: `/traffic-allocations/metrics`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* @description Returns a single allocation by id, including its targets and actor attribution.
			*
			* @tags Traffic Allocations
			* @name TrafficAllocationControllerFindOne
			* @summary Get traffic allocation
			* @request GET:/traffic-allocations/{id}
			* @secure
			*/
			trafficAllocationControllerFindOne: (id, params = {}) => this.request({
				path: `/traffic-allocations/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			})
		};
		phoneNumber = {
			/**
			* @description Use POST /phone-number instead.
			*
			* @tags Phone Numbers
			* @name PhoneNumberControllerImportTwilio
			* @summary Import Twilio Number
			* @request POST:/phone-number/import/twilio
			* @deprecated
			* @secure
			*/
			phoneNumberControllerImportTwilio: (data, params = {}) => this.request({
				path: `/phone-number/import/twilio`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* @description Use POST /phone-number instead.
			*
			* @tags Phone Numbers
			* @name PhoneNumberControllerImportVonage
			* @summary Import Vonage Number
			* @request POST:/phone-number/import/vonage
			* @deprecated
			* @secure
			*/
			phoneNumberControllerImportVonage: (data, params = {}) => this.request({
				path: `/phone-number/import/vonage`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Phone Numbers
			* @name PhoneNumberControllerCreate
			* @summary Create Phone Number
			* @request POST:/phone-number
			* @secure
			*/
			phoneNumberControllerCreate: (data, params = {}) => this.request({
				path: `/phone-number`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Phone Numbers
			* @name PhoneNumberControllerFindAll
			* @summary List Phone Numbers
			* @request GET:/phone-number
			* @secure
			*/
			phoneNumberControllerFindAll: (query, params = {}) => this.request({
				path: `/phone-number`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Phone Numbers
			* @name PhoneNumberControllerFindOne
			* @summary Get Phone Number
			* @request GET:/phone-number/{id}
			* @secure
			*/
			phoneNumberControllerFindOne: (id, params = {}) => this.request({
				path: `/phone-number/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Phone Numbers
			* @name PhoneNumberControllerUpdate
			* @summary Update Phone Number
			* @request PATCH:/phone-number/{id}
			* @secure
			*/
			phoneNumberControllerUpdate: (id, data, params = {}) => this.request({
				path: `/phone-number/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Phone Numbers
			* @name PhoneNumberControllerRemove
			* @summary Delete Phone Number
			* @request DELETE:/phone-number/{id}
			* @secure
			*/
			phoneNumberControllerRemove: (id, params = {}) => this.request({
				path: `/phone-number/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		tool = {
			/**
			* No description
			*
			* @tags Tools
			* @name ToolControllerCreate
			* @summary Create Tool
			* @request POST:/tool
			* @secure
			*/
			toolControllerCreate: (data, params = {}) => this.request({
				path: `/tool`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tools
			* @name ToolControllerFindAll
			* @summary List Tools
			* @request GET:/tool
			* @secure
			*/
			toolControllerFindAll: (query, params = {}) => this.request({
				path: `/tool`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tools
			* @name ToolControllerFindAllOrgDrafts
			* @summary List All Tool Drafts
			* @request GET:/tool/draft
			* @secure
			*/
			toolControllerFindAllOrgDrafts: (query, params = {}) => this.request({
				path: `/tool/draft`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tools
			* @name ToolControllerFindOne
			* @summary Get Tool
			* @request GET:/tool/{id}
			* @secure
			*/
			toolControllerFindOne: (id, params = {}) => this.request({
				path: `/tool/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tools
			* @name ToolControllerUpdate
			* @summary Update Tool
			* @request PATCH:/tool/{id}
			* @secure
			*/
			toolControllerUpdate: (id, data, params = {}) => this.request({
				path: `/tool/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tools
			* @name ToolControllerRemove
			* @summary Delete Tool
			* @request DELETE:/tool/{id}
			* @secure
			*/
			toolControllerRemove: (id, params = {}) => this.request({
				path: `/tool/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* @description Returns the Postgres-backed version history for the tool.
			*
			* @tags Tools
			* @name ToolControllerFindAllVersions
			* @summary List Tool Versions
			* @request GET:/tool/{id}/versions
			* @secure
			*/
			toolControllerFindAllVersions: (id, query, params = {}) => this.request({
				path: `/tool/${id}/versions`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tools
			* @name ToolControllerFindOneVersion
			* @summary Get Tool Version
			* @request GET:/tool/{id}/versions/{version}
			* @secure
			*/
			toolControllerFindOneVersion: (id, version, query, params = {}) => this.request({
				path: `/tool/${id}/versions/${version}`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tools
			* @name ToolControllerToolVersionMetadataUpdate
			* @summary Update Tool Version Metadata
			* @request PATCH:/tool/{id}/versions/{version}
			* @secure
			*/
			toolControllerToolVersionMetadataUpdate: (id, version, data, params = {}) => this.request({
				path: `/tool/${id}/versions/${version}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tools
			* @name ToolControllerSoftDeleteVersion
			* @summary Delete Tool Version
			* @request DELETE:/tool/{id}/versions/{version}
			* @secure
			*/
			toolControllerSoftDeleteVersion: (id, version, query, params = {}) => this.request({
				path: `/tool/${id}/versions/${version}`,
				method: "DELETE",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* @description Restores the selected version as the current configuration and publishes it as a new version. Deletes any drafts for this tool.
			*
			* @tags Tools
			* @name ToolControllerToolVersionRestore
			* @summary Restore Tool Version
			* @request POST:/tool/{id}/restore/{version}
			* @secure
			*/
			toolControllerToolVersionRestore: (id, version, params = {}) => this.request({
				path: `/tool/${id}/restore/${version}`,
				method: "POST",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tools
			* @name ToolControllerFindAllDrafts
			* @summary List Tool Drafts
			* @request GET:/tool/{id}/draft
			* @secure
			*/
			toolControllerFindAllDrafts: (id, query, params = {}) => this.request({
				path: `/tool/${id}/draft`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tools
			* @name ToolControllerCreateDraft
			* @summary Create Tool Draft
			* @request POST:/tool/{id}/draft
			* @secure
			*/
			toolControllerCreateDraft: (id, data, params = {}) => this.request({
				path: `/tool/${id}/draft`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tools
			* @name ToolControllerFindOneDraft
			* @summary Get Tool Draft
			* @request GET:/tool/{id}/draft/{draftId}
			* @secure
			*/
			toolControllerFindOneDraft: (id, draftId, params = {}) => this.request({
				path: `/tool/${id}/draft/${draftId}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tools
			* @name ToolControllerUpdateDraft
			* @summary Update Tool Draft
			* @request PATCH:/tool/{id}/draft/{draftId}
			* @secure
			*/
			toolControllerUpdateDraft: (id, draftId, data, params = {}) => this.request({
				path: `/tool/${id}/draft/${draftId}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tools
			* @name ToolControllerDeleteDraft
			* @summary Delete Tool Draft
			* @request DELETE:/tool/{id}/draft/{draftId}
			* @secure
			*/
			toolControllerDeleteDraft: (id, draftId, params = {}) => this.request({
				path: `/tool/${id}/draft/${draftId}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		file = {
			/**
			* @description Use POST /file instead.
			*
			* @tags Files
			* @name FileControllerCreateDeprecated
			* @summary Upload File
			* @request POST:/file/upload
			* @deprecated
			* @secure
			*/
			fileControllerCreateDeprecated: (data, params = {}) => this.request({
				path: `/file/upload`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.FormData,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Files
			* @name FileControllerCreate
			* @summary Upload File
			* @request POST:/file
			* @secure
			*/
			fileControllerCreate: (data, params = {}) => this.request({
				path: `/file`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.FormData,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Files
			* @name FileControllerFindAll
			* @summary List Files
			* @request GET:/file
			* @secure
			*/
			fileControllerFindAll: (query, params = {}) => this.request({
				path: `/file`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Files
			* @name FileControllerFindOne
			* @summary Get File
			* @request GET:/file/{id}
			* @secure
			*/
			fileControllerFindOne: (id, params = {}) => this.request({
				path: `/file/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Files
			* @name FileControllerUpdate
			* @summary Update File
			* @request PATCH:/file/{id}
			* @secure
			*/
			fileControllerUpdate: (id, data, params = {}) => this.request({
				path: `/file/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Files
			* @name FileControllerRemove
			* @summary Delete File
			* @request DELETE:/file/{id}
			* @secure
			*/
			fileControllerRemove: (id, params = {}) => this.request({
				path: `/file/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		knowledgeBase = {
			/**
			* No description
			*
			* @tags Knowledge Base
			* @name KnowledgeBaseControllerCreate
			* @summary Create Knowledge Base
			* @request POST:/knowledge-base
			* @secure
			*/
			knowledgeBaseControllerCreate: (data, params = {}) => this.request({
				path: `/knowledge-base`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Knowledge Base
			* @name KnowledgeBaseControllerFindAll
			* @summary List Knowledge Bases
			* @request GET:/knowledge-base
			* @secure
			*/
			knowledgeBaseControllerFindAll: (query, params = {}) => this.request({
				path: `/knowledge-base`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Knowledge Base
			* @name KnowledgeBaseControllerFindOne
			* @summary Get Knowledge Base
			* @request GET:/knowledge-base/{id}
			* @secure
			*/
			knowledgeBaseControllerFindOne: (id, params = {}) => this.request({
				path: `/knowledge-base/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Knowledge Base
			* @name KnowledgeBaseControllerUpdate
			* @summary Update Knowledge Base
			* @request PATCH:/knowledge-base/{id}
			* @secure
			*/
			knowledgeBaseControllerUpdate: (id, data, params = {}) => this.request({
				path: `/knowledge-base/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Knowledge Base
			* @name KnowledgeBaseControllerRemove
			* @summary Delete Knowledge Base
			* @request DELETE:/knowledge-base/{id}
			* @secure
			*/
			knowledgeBaseControllerRemove: (id, params = {}) => this.request({
				path: `/knowledge-base/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		structuredOutput = {
			/**
			* No description
			*
			* @tags Structured Outputs
			* @name StructuredOutputControllerFindAll
			* @summary List Structured Outputs
			* @request GET:/structured-output
			* @secure
			*/
			structuredOutputControllerFindAll: (query, params = {}) => this.request({
				path: `/structured-output`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Structured Outputs
			* @name StructuredOutputControllerCreate
			* @summary Create Structured Output
			* @request POST:/structured-output
			* @secure
			*/
			structuredOutputControllerCreate: (data, params = {}) => this.request({
				path: `/structured-output`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Structured Outputs
			* @name StructuredOutputControllerFindOne
			* @summary Get Structured Output
			* @request GET:/structured-output/{id}
			* @secure
			*/
			structuredOutputControllerFindOne: (id, params = {}) => this.request({
				path: `/structured-output/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Structured Outputs
			* @name StructuredOutputControllerUpdate
			* @summary Update Structured Output
			* @request PATCH:/structured-output/{id}
			* @secure
			*/
			structuredOutputControllerUpdate: (id, query, data, params = {}) => this.request({
				path: `/structured-output/${id}`,
				method: "PATCH",
				query,
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Structured Outputs
			* @name StructuredOutputControllerRemove
			* @summary Delete Structured Output
			* @request DELETE:/structured-output/{id}
			* @secure
			*/
			structuredOutputControllerRemove: (id, params = {}) => this.request({
				path: `/structured-output/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Structured Outputs
			* @name StructuredOutputControllerRun
			* @summary Run Structured Output
			* @request POST:/structured-output/run
			* @secure
			*/
			structuredOutputControllerRun: (data, params = {}) => this.request({
				path: `/structured-output/run`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			})
		};
		testSuite = {
			/**
			* No description
			*
			* @tags Test Suites
			* @name TestSuiteControllerFindAllPaginated
			* @summary List Test Suites
			* @request GET:/test-suite
			* @secure
			*/
			testSuiteControllerFindAllPaginated: (query, params = {}) => this.request({
				path: `/test-suite`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Test Suites
			* @name TestSuiteControllerCreate
			* @summary Create Test Suite
			* @request POST:/test-suite
			* @secure
			*/
			testSuiteControllerCreate: (data, params = {}) => this.request({
				path: `/test-suite`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Test Suites
			* @name TestSuiteControllerFindOne
			* @summary Get Test Suite
			* @request GET:/test-suite/{id}
			* @secure
			*/
			testSuiteControllerFindOne: (id, params = {}) => this.request({
				path: `/test-suite/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Test Suites
			* @name TestSuiteControllerUpdate
			* @summary Update Test Suite
			* @request PATCH:/test-suite/{id}
			* @secure
			*/
			testSuiteControllerUpdate: (id, data, params = {}) => this.request({
				path: `/test-suite/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Test Suites
			* @name TestSuiteControllerRemove
			* @summary Delete Test Suite
			* @request DELETE:/test-suite/{id}
			* @secure
			*/
			testSuiteControllerRemove: (id, params = {}) => this.request({
				path: `/test-suite/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Test Suite Tests
			* @name TestSuiteTestControllerFindAllPaginated
			* @summary List Tests
			* @request GET:/test-suite/{testSuiteId}/test
			* @secure
			*/
			testSuiteTestControllerFindAllPaginated: (testSuiteId, query, params = {}) => this.request({
				path: `/test-suite/${testSuiteId}/test`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Test Suite Tests
			* @name TestSuiteTestControllerCreate
			* @summary Create Test
			* @request POST:/test-suite/{testSuiteId}/test
			* @secure
			*/
			testSuiteTestControllerCreate: (testSuiteId, data, params = {}) => this.request({
				path: `/test-suite/${testSuiteId}/test`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Test Suite Tests
			* @name TestSuiteTestControllerFindOne
			* @summary Get Test
			* @request GET:/test-suite/{testSuiteId}/test/{id}
			* @secure
			*/
			testSuiteTestControllerFindOne: (testSuiteId, id, params = {}) => this.request({
				path: `/test-suite/${testSuiteId}/test/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Test Suite Tests
			* @name TestSuiteTestControllerUpdate
			* @summary Update Test
			* @request PATCH:/test-suite/{testSuiteId}/test/{id}
			* @secure
			*/
			testSuiteTestControllerUpdate: (testSuiteId, id, data, params = {}) => this.request({
				path: `/test-suite/${testSuiteId}/test/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Test Suite Tests
			* @name TestSuiteTestControllerRemove
			* @summary Delete Test
			* @request DELETE:/test-suite/{testSuiteId}/test/{id}
			* @secure
			*/
			testSuiteTestControllerRemove: (testSuiteId, id, params = {}) => this.request({
				path: `/test-suite/${testSuiteId}/test/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Test Suite Runs
			* @name TestSuiteRunControllerFindAllPaginated
			* @summary List Test Suite Runs
			* @request GET:/test-suite/{testSuiteId}/run
			* @secure
			*/
			testSuiteRunControllerFindAllPaginated: (testSuiteId, query, params = {}) => this.request({
				path: `/test-suite/${testSuiteId}/run`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Test Suite Runs
			* @name TestSuiteRunControllerCreate
			* @summary Create Test Suite Run
			* @request POST:/test-suite/{testSuiteId}/run
			* @secure
			*/
			testSuiteRunControllerCreate: (testSuiteId, data, params = {}) => this.request({
				path: `/test-suite/${testSuiteId}/run`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Test Suite Runs
			* @name TestSuiteRunControllerFindOne
			* @summary Get Test Suite Run
			* @request GET:/test-suite/{testSuiteId}/run/{id}
			* @secure
			*/
			testSuiteRunControllerFindOne: (testSuiteId, id, params = {}) => this.request({
				path: `/test-suite/${testSuiteId}/run/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Test Suite Runs
			* @name TestSuiteRunControllerUpdate
			* @summary Update Test Suite Run
			* @request PATCH:/test-suite/{testSuiteId}/run/{id}
			* @secure
			*/
			testSuiteRunControllerUpdate: (testSuiteId, id, data, params = {}) => this.request({
				path: `/test-suite/${testSuiteId}/run/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Test Suite Runs
			* @name TestSuiteRunControllerRemove
			* @summary Delete Test Suite Run
			* @request DELETE:/test-suite/{testSuiteId}/run/{id}
			* @secure
			*/
			testSuiteRunControllerRemove: (testSuiteId, id, params = {}) => this.request({
				path: `/test-suite/${testSuiteId}/run/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		eval = {
			/**
			* No description
			*
			* @tags Simulation Personalities
			* @name PersonalityControllerCreate
			* @summary Create Personality
			* @request POST:/eval/simulation/personality
			* @secure
			*/
			personalityControllerCreate: (data, params = {}) => this.request({
				path: `/eval/simulation/personality`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Personalities
			* @name PersonalityControllerFindAll
			* @summary List Personalities
			* @request GET:/eval/simulation/personality
			* @secure
			*/
			personalityControllerFindAll: (query, params = {}) => this.request({
				path: `/eval/simulation/personality`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Personalities
			* @name PersonalityControllerFindOne
			* @summary Get Personality
			* @request GET:/eval/simulation/personality/{id}
			* @secure
			*/
			personalityControllerFindOne: (id, params = {}) => this.request({
				path: `/eval/simulation/personality/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Personalities
			* @name PersonalityControllerUpdate
			* @summary Update Personality
			* @request PATCH:/eval/simulation/personality/{id}
			* @secure
			*/
			personalityControllerUpdate: (id, data, params = {}) => this.request({
				path: `/eval/simulation/personality/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Personalities
			* @name PersonalityControllerRemove
			* @summary Delete Personality
			* @request DELETE:/eval/simulation/personality/{id}
			* @secure
			*/
			personalityControllerRemove: (id, params = {}) => this.request({
				path: `/eval/simulation/personality/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Scenarios
			* @name ScenarioControllerCreate
			* @summary Create Scenario
			* @request POST:/eval/simulation/scenario
			* @secure
			*/
			scenarioControllerCreate: (data, params = {}) => this.request({
				path: `/eval/simulation/scenario`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Scenarios
			* @name ScenarioControllerFindAll
			* @summary List Scenarios
			* @request GET:/eval/simulation/scenario
			* @secure
			*/
			scenarioControllerFindAll: (query, params = {}) => this.request({
				path: `/eval/simulation/scenario`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Scenarios
			* @name ScenarioControllerFindOne
			* @summary Get Scenario
			* @request GET:/eval/simulation/scenario/{id}
			* @secure
			*/
			scenarioControllerFindOne: (id, params = {}) => this.request({
				path: `/eval/simulation/scenario/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Scenarios
			* @name ScenarioControllerUpdate
			* @summary Update Scenario
			* @request PATCH:/eval/simulation/scenario/{id}
			* @secure
			*/
			scenarioControllerUpdate: (id, data, params = {}) => this.request({
				path: `/eval/simulation/scenario/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Scenarios
			* @name ScenarioControllerRemove
			* @summary Delete Scenario
			* @request DELETE:/eval/simulation/scenario/{id}
			* @secure
			*/
			scenarioControllerRemove: (id, params = {}) => this.request({
				path: `/eval/simulation/scenario/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Runs
			* @name SimulationRunControllerCreate
			* @summary Create Simulation Run
			* @request POST:/eval/simulation/run
			* @secure
			*/
			simulationRunControllerCreate: (data, params = {}) => this.request({
				path: `/eval/simulation/run`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Runs
			* @name SimulationRunControllerFindAll
			* @summary List Simulation Runs
			* @request GET:/eval/simulation/run
			* @secure
			*/
			simulationRunControllerFindAll: (query, params = {}) => this.request({
				path: `/eval/simulation/run`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Runs
			* @name SimulationRunControllerFindOne
			* @summary Get Simulation Run
			* @request GET:/eval/simulation/run/{id}
			* @secure
			*/
			simulationRunControllerFindOne: (id, params = {}) => this.request({
				path: `/eval/simulation/run/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Runs
			* @name SimulationRunControllerCancelGroup
			* @summary Cancel Simulation Run
			* @request PATCH:/eval/simulation/run/{id}
			* @secure
			*/
			simulationRunControllerCancelGroup: (id, params = {}) => this.request({
				path: `/eval/simulation/run/${id}`,
				method: "PATCH",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Runs, Simulation Run Items
			* @name SimulationRunControllerFindItems
			* @summary List Simulation Run Items
			* @request GET:/eval/simulation/run/{id}/item
			* @secure
			*/
			simulationRunControllerFindItems: (id, query, params = {}) => this.request({
				path: `/eval/simulation/run/${id}/item`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Runs, Simulation Run Items
			* @name SimulationRunControllerFindItem
			* @summary Get Simulation Run Item
			* @request GET:/eval/simulation/run/{id}/item/{itemId}
			* @secure
			*/
			simulationRunControllerFindItem: (id, itemId, params = {}) => this.request({
				path: `/eval/simulation/run/${id}/item/${itemId}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Runs, Simulation Run Items
			* @name SimulationRunControllerCancelItem
			* @summary Cancel Simulation Run Item
			* @request PATCH:/eval/simulation/run/{id}/item/{itemId}
			* @secure
			*/
			simulationRunControllerCancelItem: (id, itemId, params = {}) => this.request({
				path: `/eval/simulation/run/${id}/item/${itemId}`,
				method: "PATCH",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Runs, Simulation Run Items
			* @name SimulationRunControllerGenerateSuggestions
			* @summary Generate Improvement Suggestions
			* @request POST:/eval/simulation/run/{id}/item/{itemId}/generate
			* @secure
			*/
			simulationRunControllerGenerateSuggestions: (id, itemId, query, params = {}) => this.request({
				path: `/eval/simulation/run/${id}/item/${itemId}/generate`,
				method: "POST",
				query,
				secure: true,
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Suites
			* @name SimulationSuiteControllerCreate
			* @summary Create Simulation Suite
			* @request POST:/eval/simulation/suite
			* @secure
			*/
			simulationSuiteControllerCreate: (data, params = {}) => this.request({
				path: `/eval/simulation/suite`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* @description Returns a pagination envelope when page, limit, name, assistantId, or squadId is supplied; otherwise returns the legacy array.
			*
			* @tags Simulation Suites
			* @name SimulationSuiteControllerFindAll
			* @summary List Simulation Suites
			* @request GET:/eval/simulation/suite
			* @secure
			*/
			simulationSuiteControllerFindAll: (query, params = {}) => this.request({
				path: `/eval/simulation/suite`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Suites
			* @name SimulationSuiteControllerDuplicate
			* @summary Duplicate simulation suite
			* @request POST:/eval/simulation/suite/{id}/duplicate
			* @secure
			*/
			simulationSuiteControllerDuplicate: (id, params = {}) => this.request({
				path: `/eval/simulation/suite/${id}/duplicate`,
				method: "POST",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Suites
			* @name SimulationSuiteControllerFindOne
			* @summary Get Simulation Suite
			* @request GET:/eval/simulation/suite/{id}
			* @secure
			*/
			simulationSuiteControllerFindOne: (id, params = {}) => this.request({
				path: `/eval/simulation/suite/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Suites
			* @name SimulationSuiteControllerUpdate
			* @summary Update Simulation Suite
			* @request PATCH:/eval/simulation/suite/{id}
			* @secure
			*/
			simulationSuiteControllerUpdate: (id, data, params = {}) => this.request({
				path: `/eval/simulation/suite/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulation Suites
			* @name SimulationSuiteControllerRemove
			* @summary Delete Simulation Suite
			* @request DELETE:/eval/simulation/suite/{id}
			* @secure
			*/
			simulationSuiteControllerRemove: (id, params = {}) => this.request({
				path: `/eval/simulation/suite/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* @description Uses AI to analyze an assistant or squad configuration and generate test scenarios
			*
			* @tags Simulations
			* @name SimulationGenerateControllerGenerate
			* @summary Generate Scenarios with AI
			* @request POST:/eval/simulation/scenario/generate
			* @secure
			*/
			simulationGenerateControllerGenerate: (data, params = {}) => this.request({
				path: `/eval/simulation/scenario/generate`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* @description Generate draft test requirements from an assistant's prompt, tools, and handoff configuration. The response includes numbered requirements describing expected behavior and open questions about behavior that needs clarification. Use this endpoint before generating a simulation suite. Review the requirements and resolve any open questions. To revise a draft, send it as `previousDraft` together with natural-language `feedback` describing the changes or answers. Once the requirements are ready, pass them to `POST /eval/simulation/onboarding/suite`. Requests can take up to 2 minutes. Each organization can draft requirements 60 times per UTC day, shared with the dashboard. A 429 `SIMULATION_ONBOARDING_QUOTA_EXCEEDED` response means the daily limit has been reached. Wait until the limit resets at 00:00 UTC before retrying.
			*
			* @tags Simulation Suites
			* @name SimulationOnboardingControllerRequirementsDraft
			* @summary Draft simulation requirements
			* @request POST:/eval/simulation/onboarding/requirements
			* @secure
			*/
			simulationOnboardingControllerRequirementsDraft: (data, params = {}) => this.request({
				path: `/eval/simulation/onboarding/requirements`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* @description Generate and save a simulation suite from reviewed test requirements, and assign it to an assistant. First draft requirements with `POST /eval/simulation/onboarding/requirements`. The response includes the saved suite, its simulations, and requirement coverage, including any gaps. Requests can take up to 3 minutes. Set a client timeout of at least 200 seconds. Use a unique `idempotencyKey` for each suite generation request. Retrying with the same key does not create a duplicate suite: - On a timeout or a 5xx (502, 504, 524), retry with the same key. You get the saved suite, a 409 while it is still generating, or a fresh generation if the first one never saved. - On a 409 `SIMULATION_ONBOARDING_GENERATION_IN_PROGRESS`, the first request is still generating. Wait `Retry-After` seconds (15) and retry with the same key. - On a 409 `SIMULATION_ONBOARDING_IDEMPOTENCY_KEY_REUSED`, the key was used for a different assistant or requirements. Send a new key. Review the generated simulations and coverage gaps. Revise the suite with `PATCH /eval/simulation/onboarding/suite/{suiteId}`, then run it with `POST /eval/simulation/run`. Each organization can generate 20 suites per UTC day, shared with the dashboard, and 2 at a time. A retry that returns a saved suite does not count toward these limits. On a 429 `SIMULATION_ONBOARDING_CONCURRENCY_LIMITED`, wait `Retry-After` seconds (30) before retrying. On a 429 `SIMULATION_ONBOARDING_QUOTA_EXCEEDED`, wait until the daily limit resets at 00:00 UTC before retrying.
			*
			* @tags Simulation Suites
			* @name SimulationOnboardingControllerSuiteCreate
			* @summary Generate a simulation suite
			* @request POST:/eval/simulation/onboarding/suite
			* @secure
			*/
			simulationOnboardingControllerSuiteCreate: (data, params = {}) => this.request({
				path: `/eval/simulation/onboarding/suite`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* @description Revise a suite created by `POST /eval/simulation/onboarding/suite`. Remove simulations, rewrite scenarios using natural-language instructions, or set `retryFailed` to regenerate scenarios that failed or exceeded generation limits. The response includes the updated suite and requirement coverage. Requests can take up to 2 minutes. Send a new `patchKey` for each edit. Replaying an applied key changes nothing and returns the current suite, with `failedEditSimulationIds` listing the simulations that edit could not rewrite, so retry a timeout or a 5xx with the same key. A suite remembers its last 50 keys, so never reuse one. Each organization can make 60 edits per UTC day, shared with the dashboard. Requests that only remove simulations and replays of applied edits do not count toward this limit. On a 429 `SIMULATION_ONBOARDING_QUOTA_EXCEEDED`, wait until the daily limit resets at 00:00 UTC before retrying.
			*
			* @tags Simulation Suites
			* @name SimulationOnboardingControllerSuiteUpdate
			* @summary Edit a generated simulation suite
			* @request PATCH:/eval/simulation/onboarding/suite/{suiteId}
			* @secure
			*/
			simulationOnboardingControllerSuiteUpdate: (suiteId, data, params = {}) => this.request({
				path: `/eval/simulation/onboarding/suite/${suiteId}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulations
			* @name SimulationControllerCreate
			* @summary Create Simulation
			* @request POST:/eval/simulation
			* @secure
			*/
			simulationControllerCreate: (data, params = {}) => this.request({
				path: `/eval/simulation`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulations
			* @name SimulationControllerFindAll
			* @summary List Simulations
			* @request GET:/eval/simulation
			* @secure
			*/
			simulationControllerFindAll: (query, params = {}) => this.request({
				path: `/eval/simulation`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulations
			* @name SimulationControllerGetConcurrency
			* @summary Get Simulation Concurrency
			* @request GET:/eval/simulation/concurrency
			* @secure
			*/
			simulationControllerGetConcurrency: (params = {}) => this.request({
				path: `/eval/simulation/concurrency`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulations
			* @name SimulationControllerFindOne
			* @summary Get Simulation
			* @request GET:/eval/simulation/{id}
			* @secure
			*/
			simulationControllerFindOne: (id, params = {}) => this.request({
				path: `/eval/simulation/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulations
			* @name SimulationControllerUpdate
			* @summary Update Simulation
			* @request PATCH:/eval/simulation/{id}
			* @secure
			*/
			simulationControllerUpdate: (id, data, params = {}) => this.request({
				path: `/eval/simulation/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Simulations
			* @name SimulationControllerRemove
			* @summary Delete Simulation
			* @request DELETE:/eval/simulation/{id}
			* @secure
			*/
			simulationControllerRemove: (id, params = {}) => this.request({
				path: `/eval/simulation/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Eval
			* @name EvalControllerCreate
			* @summary Create Eval
			* @request POST:/eval
			* @secure
			*/
			evalControllerCreate: (data, params = {}) => this.request({
				path: `/eval`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Eval
			* @name EvalControllerGetPaginated
			* @summary List Evals
			* @request GET:/eval
			* @secure
			*/
			evalControllerGetPaginated: (query, params = {}) => this.request({
				path: `/eval`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Eval
			* @name EvalControllerUpdate
			* @summary Update Eval
			* @request PATCH:/eval/{id}
			* @secure
			*/
			evalControllerUpdate: (id, data, params = {}) => this.request({
				path: `/eval/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Eval
			* @name EvalControllerRemove
			* @summary Delete Eval
			* @request DELETE:/eval/{id}
			* @secure
			*/
			evalControllerRemove: (id, params = {}) => this.request({
				path: `/eval/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Eval
			* @name EvalControllerGet
			* @summary Get Eval
			* @request GET:/eval/{id}
			* @secure
			*/
			evalControllerGet: (id, params = {}) => this.request({
				path: `/eval/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Eval
			* @name EvalControllerRemoveRun
			* @summary Delete Eval Run
			* @request DELETE:/eval/run/{id}
			* @secure
			*/
			evalControllerRemoveRun: (id, params = {}) => this.request({
				path: `/eval/run/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Eval
			* @name EvalControllerGetRun
			* @summary Get Eval Run
			* @request GET:/eval/run/{id}
			* @secure
			*/
			evalControllerGetRun: (id, params = {}) => this.request({
				path: `/eval/run/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Eval
			* @name EvalControllerRun
			* @summary Create Eval Run
			* @request POST:/eval/run
			* @secure
			*/
			evalControllerRun: (data, params = {}) => this.request({
				path: `/eval/run`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Eval
			* @name EvalControllerGetRunsPaginated
			* @summary List Eval Runs
			* @request GET:/eval/run
			* @secure
			*/
			evalControllerGetRunsPaginated: (query, params = {}) => this.request({
				path: `/eval/run`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			})
		};
		reporting = {
			/**
			* No description
			*
			* @tags Insight
			* @name InsightControllerCreate
			* @summary Create Insight
			* @request POST:/reporting/insight
			* @secure
			*/
			insightControllerCreate: (data, params = {}) => this.request({
				path: `/reporting/insight`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Insight
			* @name InsightControllerFindAll
			* @summary Get Insights
			* @request GET:/reporting/insight
			* @secure
			*/
			insightControllerFindAll: (query, params = {}) => this.request({
				path: `/reporting/insight`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Insight
			* @name InsightControllerUpdate
			* @summary Update Insight
			* @request PATCH:/reporting/insight/{id}
			* @secure
			*/
			insightControllerUpdate: (id, data, params = {}) => this.request({
				path: `/reporting/insight/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Insight
			* @name InsightControllerFindOne
			* @summary Get Insight
			* @request GET:/reporting/insight/{id}
			* @secure
			*/
			insightControllerFindOne: (id, params = {}) => this.request({
				path: `/reporting/insight/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Insight
			* @name InsightControllerRemove
			* @summary Delete Insight
			* @request DELETE:/reporting/insight/{id}
			* @secure
			*/
			insightControllerRemove: (id, params = {}) => this.request({
				path: `/reporting/insight/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Insight
			* @name InsightControllerRun
			* @summary Run Insight
			* @request POST:/reporting/insight/{id}/run
			* @secure
			*/
			insightControllerRun: (id, data, params = {}) => this.request({
				path: `/reporting/insight/${id}/run`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Insight
			* @name InsightControllerPreview
			* @summary Preview Insight
			* @request POST:/reporting/insight/preview
			* @secure
			*/
			insightControllerPreview: (data, params = {}) => this.request({
				path: `/reporting/insight/preview`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Board
			* @name BoardControllerCreate
			* @summary Create Board
			* @request POST:/reporting/board
			* @secure
			*/
			boardControllerCreate: (data, params = {}) => this.request({
				path: `/reporting/board`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Board
			* @name BoardControllerFindAll
			* @summary Get Boards
			* @request GET:/reporting/board
			* @secure
			*/
			boardControllerFindAll: (query, params = {}) => this.request({
				path: `/reporting/board`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Board
			* @name BoardControllerMetricsOverviewEnsure
			* @summary Get Default Metrics Overview Board
			* @request GET:/reporting/board/default/metrics-overview
			* @secure
			*/
			boardControllerMetricsOverviewEnsure: (params = {}) => this.request({
				path: `/reporting/board/default/metrics-overview`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Board
			* @name BoardControllerUpdate
			* @summary Update Board
			* @request PATCH:/reporting/board/{id}
			* @secure
			*/
			boardControllerUpdate: (id, data, params = {}) => this.request({
				path: `/reporting/board/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Board
			* @name BoardControllerFindOne
			* @summary Get Board
			* @request GET:/reporting/board/{id}
			* @secure
			*/
			boardControllerFindOne: (id, params = {}) => this.request({
				path: `/reporting/board/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Board
			* @name BoardControllerRemove
			* @summary Delete Board
			* @request DELETE:/reporting/board/{id}
			* @secure
			*/
			boardControllerRemove: (id, params = {}) => this.request({
				path: `/reporting/board/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		observability = {
			/**
			* No description
			*
			* @tags Observability/Scorecard
			* @name ScorecardControllerGet
			* @summary Get Scorecard
			* @request GET:/observability/scorecard/{id}
			* @secure
			*/
			scorecardControllerGet: (id, params = {}) => this.request({
				path: `/observability/scorecard/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Observability/Scorecard
			* @name ScorecardControllerUpdate
			* @summary Update Scorecard
			* @request PATCH:/observability/scorecard/{id}
			* @secure
			*/
			scorecardControllerUpdate: (id, data, params = {}) => this.request({
				path: `/observability/scorecard/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Observability/Scorecard
			* @name ScorecardControllerRemove
			* @summary Delete Scorecard
			* @request DELETE:/observability/scorecard/{id}
			* @secure
			*/
			scorecardControllerRemove: (id, params = {}) => this.request({
				path: `/observability/scorecard/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Observability/Scorecard
			* @name ScorecardControllerGetPaginated
			* @summary List Scorecards
			* @request GET:/observability/scorecard
			* @secure
			*/
			scorecardControllerGetPaginated: (query, params = {}) => this.request({
				path: `/observability/scorecard`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Observability/Scorecard
			* @name ScorecardControllerCreate
			* @summary Create Scorecard
			* @request POST:/observability/scorecard
			* @secure
			*/
			scorecardControllerCreate: (data, params = {}) => this.request({
				path: `/observability/scorecard`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			})
		};
		org = {
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerCreate
			* @summary Create Org
			* @request POST:/org
			* @secure
			*/
			orgControllerCreate: (data, params = {}) => this.request({
				path: `/org`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerFindAll
			* @summary List Orgs
			* @request GET:/org
			* @secure
			*/
			orgControllerFindAll: (params = {}) => this.request({
				path: `/org`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerFeatureFlagEnabled
			* @summary Check if Feature Flag is enabled
			* @request GET:/org/feature-flag
			* @secure
			*/
			orgControllerFeatureFlagEnabled: (query, params = {}) => this.request({
				path: `/org/feature-flag`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* @description Returns the call concurrency limits and API rate limit usage for the authenticated org. Read-only and cheap enough to poll every few seconds. The X-RateLimit-* response headers describe this endpoint's own polling ceiling, not the API budget reported in apiLimits.
			*
			* @tags Orgs
			* @name OrgControllerLimitsGet
			* @summary Get org limits
			* @request GET:/org/limits
			* @secure
			*/
			orgControllerLimitsGet: (params = {}) => this.request({
				path: `/org/limits`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerFindOne
			* @summary Get Org
			* @request GET:/org/{id}
			* @secure
			*/
			orgControllerFindOne: (id, params = {}) => this.request({
				path: `/org/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerUpdate
			* @summary Update Org
			* @request PATCH:/org/{id}
			* @secure
			*/
			orgControllerUpdate: (id, data, params = {}) => this.request({
				path: `/org/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerDeleteOrg
			* @summary Delete Org
			* @request DELETE:/org/{id}
			* @secure
			*/
			orgControllerDeleteOrg: (id, params = {}) => this.request({
				path: `/org/${id}`,
				method: "DELETE",
				secure: true,
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerFindAllUsers
			* @summary List Users
			* @request GET:/org/{id}/user
			* @secure
			*/
			orgControllerFindAllUsers: (id, params = {}) => this.request({
				path: `/org/${id}/user`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerOrgLeave
			* @summary Leave Org
			* @request DELETE:/org/{id}/leave
			* @secure
			*/
			orgControllerOrgLeave: (id, params = {}) => this.request({
				path: `/org/${id}/leave`,
				method: "DELETE",
				secure: true,
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerOrgRemoveUser
			* @summary Remove Org Member
			* @request DELETE:/org/{id}/member/{memberId}/leave
			* @secure
			*/
			orgControllerOrgRemoveUser: (id, memberId, params = {}) => this.request({
				path: `/org/${id}/member/${memberId}/leave`,
				method: "DELETE",
				secure: true,
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerUsersInvite
			* @summary Invite User
			* @request POST:/org/{id}/invite
			* @secure
			*/
			orgControllerUsersInvite: (id, data, params = {}) => this.request({
				path: `/org/${id}/invite`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerPendingInvitationsList
			* @summary List Pending Organization Invitations
			* @request GET:/org/{id}/invitations/pending
			* @secure
			*/
			orgControllerPendingInvitationsList: (id, params = {}) => this.request({
				path: `/org/${id}/invitations/pending`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerPendingInvitationRevoke
			* @summary Revoke Pending Organization Invitation
			* @request DELETE:/org/{id}/invitations/{invitationId}
			* @secure
			*/
			orgControllerPendingInvitationRevoke: (id, invitationId, params = {}) => this.request({
				path: `/org/${id}/invitations/${invitationId}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerUserUpdate
			* @summary Update User Role
			* @request PATCH:/org/{id}/role
			* @secure
			*/
			orgControllerUserUpdate: (id, data, params = {}) => this.request({
				path: `/org/${id}/role`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerOrgToken
			* @summary Generate User Org JWT
			* @request GET:/org/{id}/auth
			* @secure
			*/
			orgControllerOrgToken: (id, params = {}) => this.request({
				path: `/org/${id}/auth`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerZdrBuy
			* @summary Purchase ZDR add-on
			* @request POST:/org/{id}/zdr
			* @secure
			*/
			orgControllerZdrBuy: (id, params = {}) => this.request({
				path: `/org/${id}/zdr`,
				method: "POST",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Orgs
			* @name OrgControllerZdrRemove
			* @summary Remove ZDR add-on
			* @request DELETE:/org/{id}/zdr
			* @secure
			*/
			orgControllerZdrRemove: (id, params = {}) => this.request({
				path: `/org/${id}/zdr`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		token = {
			/**
			* No description
			*
			* @tags Tokens
			* @name TokenControllerCreate
			* @summary Create Token
			* @request POST:/token
			* @secure
			*/
			tokenControllerCreate: (data, params = {}) => this.request({
				path: `/token`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tokens
			* @name TokenControllerFindAll
			* @summary List Tokens
			* @request GET:/token
			* @secure
			*/
			tokenControllerFindAll: (query, params = {}) => this.request({
				path: `/token`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tokens
			* @name TokenControllerFindOne
			* @summary Get Token
			* @request GET:/token/{id}
			* @secure
			*/
			tokenControllerFindOne: (id, params = {}) => this.request({
				path: `/token/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tokens
			* @name TokenControllerUpdate
			* @summary Update Token
			* @request PATCH:/token/{id}
			* @secure
			*/
			tokenControllerUpdate: (id, data, params = {}) => this.request({
				path: `/token/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Tokens
			* @name TokenControllerRemove
			* @summary Delete Token
			* @request DELETE:/token/{id}
			* @secure
			*/
			tokenControllerRemove: (id, params = {}) => this.request({
				path: `/token/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		credential = {
			/**
			* No description
			*
			* @tags Credentials
			* @name CredentialControllerCreate
			* @summary Create Credential
			* @request POST:/credential
			* @secure
			*/
			credentialControllerCreate: (data, params = {}) => this.request({
				path: `/credential`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Credentials
			* @name CredentialControllerFindAll
			* @summary List Credentials
			* @request GET:/credential
			* @secure
			*/
			credentialControllerFindAll: (query, params = {}) => this.request({
				path: `/credential`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Credentials
			* @name CredentialControllerFindOne
			* @summary Get Credential
			* @request GET:/credential/{id}
			* @secure
			*/
			credentialControllerFindOne: (id, params = {}) => this.request({
				path: `/credential/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Credentials
			* @name CredentialControllerUpdate
			* @summary Update Credential
			* @request PATCH:/credential/{id}
			* @secure
			*/
			credentialControllerUpdate: (id, data, params = {}) => this.request({
				path: `/credential/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Credentials
			* @name CredentialControllerRemove
			* @summary Delete Credential
			* @request DELETE:/credential/{id}
			* @secure
			*/
			credentialControllerRemove: (id, params = {}) => this.request({
				path: `/credential/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		template = {
			/**
			* No description
			*
			* @tags Templates
			* @name TemplateControllerCreate
			* @summary Create Template
			* @request POST:/template
			* @secure
			*/
			templateControllerCreate: (data, params = {}) => this.request({
				path: `/template`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Templates
			* @name TemplateControllerFindAll
			* @summary List Templates
			* @request GET:/template
			* @secure
			*/
			templateControllerFindAll: (query, params = {}) => this.request({
				path: `/template`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Templates
			* @name TemplateControllerFindAllPinned
			* @summary List Templates
			* @request GET:/template/pinned
			* @secure
			*/
			templateControllerFindAllPinned: (params = {}) => this.request({
				path: `/template/pinned`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Templates
			* @name TemplateControllerFindOne
			* @summary Get Template
			* @request GET:/template/{id}
			* @secure
			*/
			templateControllerFindOne: (id, params = {}) => this.request({
				path: `/template/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Templates
			* @name TemplateControllerUpdate
			* @summary Update Template
			* @request PATCH:/template/{id}
			* @secure
			*/
			templateControllerUpdate: (id, data, params = {}) => this.request({
				path: `/template/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Templates
			* @name TemplateControllerRemove
			* @summary Delete Template
			* @request DELETE:/template/{id}
			* @secure
			*/
			templateControllerRemove: (id, params = {}) => this.request({
				path: `/template/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			})
		};
		voiceLibrary = {
			/**
			* No description
			*
			* @tags Voice Library
			* @name VoiceLibraryControllerVoiceGetByProvider
			* @summary Get voices in Voice Library by Provider
			* @request GET:/voice-library/{provider}
			* @secure
			*/
			voiceLibraryControllerVoiceGetByProvider: (provider, query, params = {}) => this.request({
				path: `/voice-library/${provider}`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Voice Library
			* @name VoiceLibraryControllerVoiceGetAccentsByProvider
			* @summary Get accents in Voice Library by Provider
			* @request GET:/voice-library/{provider}/accents
			* @secure
			*/
			voiceLibraryControllerVoiceGetAccentsByProvider: (provider, params = {}) => this.request({
				path: `/voice-library/${provider}/accents`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Voice Library
			* @name VoiceLibraryControllerVoiceLibrarySyncByProvider
			* @summary Sync Private voices in Voice Library by Provider
			* @request POST:/voice-library/sync/{provider}
			* @secure
			*/
			voiceLibraryControllerVoiceLibrarySyncByProvider: (provider, params = {}) => this.request({
				path: `/voice-library/sync/${provider}`,
				method: "POST",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Voice Library
			* @name VoiceLibraryControllerVoiceLibrarySyncDefaultVoices
			* @summary Sync Default voices in Voice Library by Providers
			* @request POST:/voice-library/sync
			* @secure
			*/
			voiceLibraryControllerVoiceLibrarySyncDefaultVoices: (data, params = {}) => this.request({
				path: `/voice-library/sync`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Voice Library
			* @name VoiceLibraryControllerVoiceLibraryCreateSesameVoice
			* @summary Create a new voice in the Voice Library using Sesame
			* @request POST:/voice-library/create-sesame-voice
			* @secure
			*/
			voiceLibraryControllerVoiceLibraryCreateSesameVoice: (data, params = {}) => this.request({
				path: `/voice-library/create-sesame-voice`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.FormData,
				...params
			}),
			/**
			* No description
			*
			* @tags Voice Library
			* @name VoiceLibraryControllerVoiceLibraryVoiceUpdate
			* @summary Update a Voice Library voice (name/description).
			* @request PATCH:/voice-library/{id}
			* @secure
			*/
			voiceLibraryControllerVoiceLibraryVoiceUpdate: (id, data, params = {}) => this.request({
				path: `/voice-library/${id}`,
				method: "PATCH",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Voice Library
			* @name VoiceLibraryControllerVoiceLibraryVoiceDelete
			* @summary Delete a Voice Library voice.
			* @request DELETE:/voice-library/{id}
			* @secure
			*/
			voiceLibraryControllerVoiceLibraryVoiceDelete: (id, params = {}) => this.request({
				path: `/voice-library/${id}`,
				method: "DELETE",
				secure: true,
				...params
			})
		};
		provider = {
			/**
			* No description
			*
			* @tags Provider Resources
			* @name ProviderResourceControllerCreateProviderResource
			* @summary Create Provider Resource
			* @request POST:/provider/{provider}/{resourceName}
			* @secure
			*/
			providerResourceControllerCreateProviderResource: (provider, resourceName, params = {}) => this.request({
				path: `/provider/${provider}/${resourceName}`,
				method: "POST",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Provider Resources
			* @name ProviderResourceControllerGetProviderResourcesPaginated
			* @summary List Provider Resources
			* @request GET:/provider/{provider}/{resourceName}
			* @secure
			*/
			providerResourceControllerGetProviderResourcesPaginated: (provider, resourceName, query, params = {}) => this.request({
				path: `/provider/${provider}/${resourceName}`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Provider Resources
			* @name ProviderResourceControllerGetProviderResource
			* @summary Get Provider Resource
			* @request GET:/provider/{provider}/{resourceName}/{id}
			* @secure
			*/
			providerResourceControllerGetProviderResource: (provider, resourceName, id, params = {}) => this.request({
				path: `/provider/${provider}/${resourceName}/${id}`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Provider Resources
			* @name ProviderResourceControllerDeleteProviderResource
			* @summary Delete Provider Resource
			* @request DELETE:/provider/{provider}/{resourceName}/{id}
			* @secure
			*/
			providerResourceControllerDeleteProviderResource: (provider, resourceName, id, params = {}) => this.request({
				path: `/provider/${provider}/${resourceName}/${id}`,
				method: "DELETE",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Provider Resources
			* @name ProviderResourceControllerUpdateProviderResource
			* @summary Update Provider Resource
			* @request PATCH:/provider/{provider}/{resourceName}/{id}
			* @secure
			*/
			providerResourceControllerUpdateProviderResource: (provider, resourceName, id, params = {}) => this.request({
				path: `/provider/${provider}/${resourceName}/${id}`,
				method: "PATCH",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Providers
			* @name ProviderControllerGetWorkflows
			* @request GET:/{provider}/workflows
			* @secure
			*/
			providerControllerGetWorkflows: (provider, query, params = {}) => this.request({
				path: `/${provider}/workflows`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Providers
			* @name ProviderControllerGetWorkflowTriggerHook
			* @request GET:/{provider}/workflows/{workflowId}/hooks
			* @secure
			*/
			providerControllerGetWorkflowTriggerHook: (provider, workflowId, params = {}) => this.request({
				path: `/${provider}/workflows/${workflowId}/hooks`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Providers
			* @name ProviderControllerGetLocations
			* @request GET:/{provider}/locations
			* @secure
			*/
			providerControllerGetLocations: (provider, params = {}) => this.request({
				path: `/${provider}/locations`,
				method: "GET",
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Providers
			* @name VoiceProviderControllerSearchVoices
			* @summary Search Voice from Provider Voice Library.
			* @request GET:/{provider}/voices/search
			* @deprecated
			* @secure
			*/
			voiceProviderControllerSearchVoices: (provider, query, params = {}) => this.request({
				path: `/${provider}/voices/search`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Providers
			* @name VoiceProviderControllerSearchVoice
			* @summary Search Voice from Provider Voice Library.
			* @request GET:/{provider}/voice/search
			* @secure
			*/
			voiceProviderControllerSearchVoice: (provider, query, params = {}) => this.request({
				path: `/${provider}/voice/search`,
				method: "GET",
				query,
				secure: true,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Providers
			* @name VoiceProviderControllerAddVoices
			* @summary Add Shared Voice to your Provider Account.
			* @request POST:/{provider}/voices/add
			* @deprecated
			* @secure
			*/
			voiceProviderControllerAddVoices: (provider, data, params = {}) => this.request({
				path: `/${provider}/voices/add`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			}),
			/**
			* No description
			*
			* @tags Providers
			* @name VoiceProviderControllerAddVoice
			* @summary Add Shared Voice to your Provider Account.
			* @request POST:/{provider}/voice/add
			* @secure
			*/
			voiceProviderControllerAddVoice: (provider, data, params = {}) => this.request({
				path: `/${provider}/voice/add`,
				method: "POST",
				body: data,
				secure: true,
				type: ContentType.Json,
				format: "json",
				...params
			})
		};
		v11Labs = { 
		/**
		* No description
		*
		* @tags Providers
		* @name VoiceProviderControllerCloneVoices
		* @summary Clone a voice to the provider account and add to Vapi Voice Library.
		* @request POST:/11labs/voice/clone
		* @secure
		*/
voiceProviderControllerCloneVoices: (data, params = {}) => this.request({
			path: `/11labs/voice/clone`,
			method: "POST",
			body: data,
			secure: true,
			type: ContentType.FormData,
			...params
		}) };
		vapi = { 
		/**
		* No description
		*
		* @tags Providers
		* @name VoiceProviderControllerCloneVapiVoice
		* @summary Clone a Vapi Voice (xAI-backed) and add it to your Voice Library.
		* @request POST:/vapi/voice/clone
		* @secure
		*/
voiceProviderControllerCloneVapiVoice: (data, params = {}) => this.request({
			path: `/vapi/voice/clone`,
			method: "POST",
			body: data,
			secure: true,
			type: ContentType.FormData,
			...params
		}) };
		analytics = { 
		/**
		* No description
		*
		* @tags Analytics
		* @name AnalyticsControllerQuery
		* @summary Create Analytics Queries
		* @request POST:/analytics
		* @secure
		*/
analyticsControllerQuery: (data, params = {}) => this.request({
			path: `/analytics`,
			method: "POST",
			body: data,
			secure: true,
			type: ContentType.Json,
			format: "json",
			...params
		}) };
	};
	exports.Api = Api;
}));
//#endregion
//#region node_modules/@vapi-ai/web/dist/client.js
var require_client = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.client = void 0;
	exports.client = new (require_api()).Api({
		baseUrl: "https://api.vapi.ai",
		baseApiParams: { secure: true },
		securityWorker: async (securityData) => {
			if (securityData) return { headers: { Authorization: `Bearer ${securityData}` } };
		}
	});
}));
//#endregion
//#region node_modules/@vapi-ai/web/dist/daily-guards.js
var require_daily_guards = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createSafeDailyConfig = createSafeDailyConfig;
	exports.safeSetLocalAudio = safeSetLocalAudio;
	exports.safeSetInputDevicesAsync = safeSetInputDevicesAsync;
	exports.createSafeDailyFactoryOptions = createSafeDailyFactoryOptions;
	function createSafeDailyConfig(config) {
		if (!config) return {};
		const { alwaysIncludeMicInPermissionPrompt, ...rest } = config;
		if (alwaysIncludeMicInPermissionPrompt === false) {
			console.warn("[Vapi] alwaysIncludeMicInPermissionPrompt:false detected. This can cause Chrome 140+ issues. Removing the property.");
			return rest;
		}
		return config;
	}
	function safeSetLocalAudio(call, enabled) {
		if (!call) throw new Error("Call object is not available.");
		call.setLocalAudio(enabled);
	}
	async function safeSetInputDevicesAsync(call, options) {
		if (!call) throw new Error("Call object is not available.");
		if ("audioSource" in options && options.audioSource === false) {
			console.warn("[Vapi] setInputDevicesAsync with audioSource:false detected. This can cause Chrome 140+ issues. Using default device instead.");
			const { audioSource, ...safeOptions } = options;
			await call.setInputDevicesAsync(safeOptions);
			return;
		}
		await call.setInputDevicesAsync(options);
	}
	function createSafeDailyFactoryOptions(options) {
		if (!options) return {};
		if (options.audioSource === false) {
			console.warn("[Vapi] audioSource:false detected in factory options. This can cause Chrome 140+ issues. Defaulting to true.");
			return {
				...options,
				audioSource: true
			};
		}
		return options;
	}
}));
//#endregion
//#region node_modules/@vapi-ai/web/dist/vapi.js
var require_vapi = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var daily_js_1 = __importDefault((init_daily_esm(), __toCommonJS(daily_esm_exports)));
	var events_1 = __importDefault(__require("events"));
	var client_1 = require_client();
	var daily_guards_1 = require_daily_guards();
	/**
	* Extracts error details into a plain object that serializes properly to JSON.
	* Error objects don't serialize well because their properties (message, stack, name)
	* are not enumerable and get lost when using JSON.stringify().
	*/
	function serializeError(error) {
		if (error === null || error === void 0) return { message: "Unknown error (null or undefined)" };
		if (error instanceof Error) {
			const serialized = {
				message: error.message,
				name: error.name,
				stack: error.stack
			};
			const errorAsAny = error;
			if (errorAsAny.code !== void 0) serialized.code = errorAsAny.code;
			if (errorAsAny.cause !== void 0) serialized.cause = String(errorAsAny.cause);
			if (errorAsAny.reason !== void 0) serialized.reason = errorAsAny.reason;
			if (errorAsAny.details !== void 0) serialized.details = errorAsAny.details;
			if (errorAsAny.errorMsg !== void 0) serialized.errorMsg = errorAsAny.errorMsg;
			if (errorAsAny.error !== void 0 && typeof errorAsAny.error === "string") serialized.errorDetail = errorAsAny.error;
			return serialized;
		}
		if (typeof error === "string") return { message: error };
		if (typeof error === "object") {
			const errorObj = error;
			return {
				message: errorObj.message || errorObj.error || JSON.stringify(error),
				...errorObj
			};
		}
		return { message: String(error) };
	}
	var VIDEO_RECORDING_START_FAILED_MESSAGE_TYPE = "video-recording.start-failed";
	async function startAudioPlayer(player, track) {
		player.muted = false;
		player.autoplay = true;
		if (track != null) {
			player.srcObject = new MediaStream([track]);
			await player.play();
		}
	}
	async function buildAudioPlayer(track, participantId, volume) {
		const player = document.createElement("audio");
		player.dataset.participantId = participantId;
		if (typeof volume === "number") player.volume = volume;
		document.body.appendChild(player);
		try {
			await startAudioPlayer(player, track);
		} catch (error) {
			player.remove();
			throw error;
		}
		return player;
	}
	function destroyAudioPlayer(participantId) {
		document.querySelector(`audio[data-participant-id="${participantId}"]`)?.remove();
	}
	function subscribeToTracks(e, call, isVideoRecordingEnabled) {
		if (e.participant.local) return;
		call.updateParticipant(e.participant.session_id, { setSubscribedTracks: {
			audio: true,
			video: isVideoRecordingEnabled
		} });
	}
	var VapiEventEmitter = class extends events_1.default {
		on(event, listener) {
			super.on(event, listener);
			return this;
		}
		once(event, listener) {
			super.once(event, listener);
			return this;
		}
		emit(event, ...args) {
			return super.emit(event, ...args);
		}
		removeListener(event, listener) {
			super.removeListener(event, listener);
			return this;
		}
		removeAllListeners(event) {
			super.removeAllListeners(event);
			return this;
		}
	};
	var Vapi = class extends VapiEventEmitter {
		started = false;
		call = null;
		audioPlayer = null;
		desiredVolume = null;
		audioBuildSequence = 0;
		pendingAudioBuilds = /* @__PURE__ */ new Map();
		attachedAudioBuild = 0;
		speakingTimeout = null;
		dailyCallConfig = {};
		dailyCallObject = {};
		microphoneTrack = null;
		cancelMicrophonePreflight = null;
		async microphoneAcquire() {
			const source = this.dailyCallObject.audioSource;
			if (source && typeof source === "object") {
				if (source.readyState === "ended") throw new DOMException("The supplied microphone track has ended.", "NotReadableError");
				return source;
			}
			return new Promise((resolve, reject) => {
				let cancelled = false;
				this.cancelMicrophonePreflight = () => {
					cancelled = true;
					reject(new DOMException("Microphone preflight cancelled.", "AbortError"));
				};
				navigator.mediaDevices.getUserMedia({ audio: typeof source === "string" ? { deviceId: { exact: source } } : true }).then((stream) => {
					const track = stream.getAudioTracks()[0];
					if (cancelled || !track || track.readyState === "ended") {
						stream.getTracks().forEach((item) => item.stop());
						reject(new DOMException("No live microphone track available.", "NotFoundError"));
						return;
					}
					stream.getTracks().filter((item) => item !== track).forEach((item) => item.stop());
					this.microphoneTrack = track;
					resolve(track);
				}, reject);
			}).finally(() => {
				this.cancelMicrophonePreflight = null;
			});
		}
		hasEmittedCallEndedStatus = false;
		constructor(apiToken, apiBaseUrl, dailyCallConfig, dailyCallObject) {
			super();
			client_1.client.baseUrl = apiBaseUrl ?? "https://api.vapi.ai";
			client_1.client.setSecurityData(apiToken);
			this.dailyCallConfig = (0, daily_guards_1.createSafeDailyConfig)(dailyCallConfig);
			this.dailyCallObject = (0, daily_guards_1.createSafeDailyFactoryOptions)(dailyCallObject);
		}
		async cleanup() {
			this.microphoneTrack?.stop();
			this.microphoneTrack = null;
			this.started = false;
			this.hasEmittedCallEndedStatus = false;
			if (this.call) {
				await this.call.destroy();
				this.call = null;
			}
			this.audioPlayer = null;
			this.pendingAudioBuilds.clear();
			this.speakingTimeout = null;
		}
		isMobileDevice() {
			if (typeof navigator === "undefined") return false;
			const userAgent = navigator.userAgent;
			return /android|iphone|ipad|ipod|iemobile|blackberry|bada/i.test(userAgent.toLowerCase());
		}
		async sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		}
		/**
		* Reports a failed audio processing update on the SDK's `error` event.
		*
		* Daily applies input settings inside its remotely loaded call machine, so a
		* failure - Krisp's `KrispInitError: Canceled`, for example - arrives as a
		* rejected promise, which a synchronous try/catch around
		* `updateInputSettings()` cannot see. Without this the rejection escapes to
		* the page as an unhandled rejection instead of reaching the listeners
		* consumers register. Audio processing is non-critical, so the call continues.
		*/
		emitAudioProcessingError(stage, error) {
			this.emit("error", {
				type: `${stage}-error`,
				stage,
				error: serializeError(error),
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			});
		}
		/**
		* Starts Daily's local (microphone) audio level observer.
		*
		* Only runs when something is listening for 'local-volume-level'. The observer
		* costs an AudioContext plus an AudioWorklet for the lifetime of the call and
		* nothing else in the SDK reads the level, so starting it unconditionally
		* charges every consumer for a feature almost none of them use. Listeners
		* attached after the call is under way should call the public
		* `startLocalAudioLevelObserver()`.
		*
		* Must run after the noise-cancellation processor has settled. Krisp replaces
		* the microphone track, Daily reacts to any local track change by closing the
		* AudioContext its in-flight `audioWorklet.addModule()` is still loading into,
		* and Chrome and Firefox reject that load with "AbortError: Unable to load a
		* worklet's module". Daily answers by stopping the observer for the rest of
		* the call, so losing this race costs the feature, not just console noise.
		* Tracked upstream at https://github.com/daily-co/daily-js/issues/317.
		*/
		async maybeStartLocalAudioLevelObserver() {
			if (!this.call || this.listenerCount("local-volume-level") === 0) return;
			try {
				await this.call.startLocalAudioLevelObserver(100);
			} catch (error) {
				this.emit("local-audio-level-observer-error", serializeError(error));
			}
		}
		async start(assistant, assistantOverrides, squad, workflow, workflowOverrides, options) {
			const startTime = Date.now();
			if (!assistant && !squad && !workflow) {
				const error = /* @__PURE__ */ new Error("Assistant or Squad or Workflow must be provided.");
				this.emit("error", {
					type: "validation-error",
					stage: "input-validation",
					error: serializeError(error),
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				});
				throw error;
			}
			if (this.started) {
				this.emit("call-start-progress", {
					stage: "validation",
					status: "failed",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					metadata: { reason: "already-started" }
				});
				return null;
			}
			this.emit("call-start-progress", {
				stage: "initialization",
				status: "started",
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				metadata: {
					hasAssistant: !!assistant,
					hasSquad: !!squad,
					hasWorkflow: !!workflow
				}
			});
			this.started = true;
			let failureStage = "microphone-preflight";
			try {
				if (this.call) {
					await this.cleanup();
					this.started = true;
				}
				const audioSource = options?.microphonePreflightEnabled === false ? this.dailyCallObject.audioSource ?? true : await this.microphoneAcquire();
				failureStage = "unknown";
				this.emit("call-start-progress", {
					stage: "web-call-creation",
					status: "started",
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				});
				const webCallStartTime = Date.now();
				const createWebCallBody = {
					assistant: typeof assistant === "string" ? void 0 : assistant,
					assistantId: typeof assistant === "string" ? assistant : void 0,
					assistantOverrides,
					squad: typeof squad === "string" ? void 0 : squad,
					squadId: typeof squad === "string" ? squad : void 0,
					workflow: typeof workflow === "string" ? void 0 : workflow,
					workflowId: typeof workflow === "string" ? workflow : void 0,
					workflowOverrides,
					roomDeleteOnUserLeaveEnabled: options?.roomDeleteOnUserLeaveEnabled,
					videoRecordingStartMode: options?.videoRecordingStartMode
				};
				const webCall = (await client_1.client.call.callControllerCreateWebCall(createWebCallBody)).data;
				const webCallDuration = Date.now() - webCallStartTime;
				this.emit("call-start-progress", {
					stage: "web-call-creation",
					status: "completed",
					duration: webCallDuration,
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					metadata: {
						callId: webCall?.id || "unknown",
						videoRecordingEnabled: webCall?.artifactPlan?.videoRecordingEnabled ?? false,
						voiceProvider: webCall?.assistant?.voice?.provider || "unknown"
					}
				});
				const isVideoRecordingEnabled = webCall?.artifactPlan?.videoRecordingEnabled ?? false;
				const transport = webCall?.transport;
				const callToken = transport?.callToken;
				const isRecordingStartedByServer = transport?.videoRecordingStartMode === "server";
				const recordingTokenMissing = isVideoRecordingEnabled && !callToken;
				this.emit("call-start-progress", {
					stage: "daily-call-object-creation",
					status: "started",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					metadata: {
						audioSource: this.dailyCallObject.audioSource ?? true,
						videoSource: this.dailyCallObject.videoSource ?? isVideoRecordingEnabled,
						isVideoRecordingEnabled
					}
				});
				const dailyCallStartTime = Date.now();
				try {
					this.call = daily_js_1.default.createCallObject({
						audioSource,
						videoSource: this.dailyCallObject.videoSource ?? isVideoRecordingEnabled,
						dailyConfig: this.dailyCallConfig
					});
					const dailyCallDuration = Date.now() - dailyCallStartTime;
					this.emit("call-start-progress", {
						stage: "daily-call-object-creation",
						status: "completed",
						duration: dailyCallDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
				} catch (error) {
					const dailyCallDuration = Date.now() - dailyCallStartTime;
					const serializedError = serializeError(error);
					this.emit("call-start-progress", {
						stage: "daily-call-object-creation",
						status: "failed",
						duration: dailyCallDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString(),
						metadata: { error: serializedError.message }
					});
					this.emit("error", {
						type: "daily-call-object-creation-error",
						stage: "daily-call-object-creation",
						error: serializedError,
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
					throw error;
				}
				this.call.iframe()?.style.setProperty("display", "none");
				this.call.on("left-meeting", () => {
					this.emit("call-end");
					if (!this.hasEmittedCallEndedStatus) {
						this.emit("message", {
							type: "status-update",
							status: "ended",
							"endedReason": "customer-ended-call"
						});
						this.hasEmittedCallEndedStatus = true;
					}
					if (isVideoRecordingEnabled) this.call?.stopRecording();
					this.cleanup().catch(console.error);
				});
				this.call.on("error", (error) => {
					this.emit("error", {
						type: "daily-error",
						error: serializeError(error),
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
					if (isVideoRecordingEnabled) this.call?.stopRecording();
				});
				this.call.on("camera-error", (error) => {
					this.emit("camera-error", {
						type: "camera-error",
						error: serializeError(error),
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
				});
				this.call.on("network-quality-change", (event) => {
					this.emit("network-quality-change", event);
				});
				this.call.on("network-connection", (event) => {
					this.emit("network-connection", event);
				});
				this.call.on("recording-started", (event) => {
					if (event) this.emit("recording-started", event);
				});
				this.call.on("recording-stopped", (event) => {
					if (event) this.emit("recording-stopped", event);
				});
				this.call.on("recording-stats", (event) => {
					if (event) this.emit("recording-stats", event);
				});
				this.call.on("recording-error", (event) => {
					if (event) this.emit("recording-error", event);
				});
				this.call.on("recording-upload-completed", (event) => {
					if (event) this.emit("recording-upload-completed", event);
				});
				this.call.on("track-started", (e) => this.handleTrackStarted(e));
				this.call.on("participant-joined", (e) => {
					if (!e || !this.call) return;
					subscribeToTracks(e, this.call, isVideoRecordingEnabled);
				});
				this.call.on("participant-updated", (e) => {
					if (!e) return;
					this.emit("daily-participant-updated", e.participant);
				});
				this.call.on("participant-left", (e) => {
					if (!e) return;
					this.detachAudioPlayer(e.participant.session_id);
				});
				this.call.on("app-message", (e) => this.onAppMessage(e));
				let recordingRequestedTime = 0;
				if (isVideoRecordingEnabled) this.call.once("recording-started", () => {
					const totalRecordingDelay = ((/* @__PURE__ */ new Date()).getTime() - recordingRequestedTime) / 1e3;
					this.emit("call-start-progress", {
						stage: "video-recording-started",
						status: "completed",
						timestamp: (/* @__PURE__ */ new Date()).toISOString(),
						metadata: { delaySeconds: totalRecordingDelay }
					});
					this.send({
						type: "control",
						control: "say-first-message",
						videoRecordingStartDelaySeconds: totalRecordingDelay
					});
				});
				const isMobile = this.isMobileDevice();
				this.emit("call-start-progress", {
					stage: "mobile-permissions",
					status: "started",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					metadata: { isMobile }
				});
				if (isMobile) {
					const mobileWaitStartTime = Date.now();
					await this.sleep(1e3);
					const mobileWaitDuration = Date.now() - mobileWaitStartTime;
					this.emit("call-start-progress", {
						stage: "mobile-permissions",
						status: "completed",
						duration: mobileWaitDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString(),
						metadata: { action: "permissions-wait" }
					});
				} else this.emit("call-start-progress", {
					stage: "mobile-permissions",
					status: "completed",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					metadata: { action: "skipped-not-mobile" }
				});
				this.emit("call-start-progress", {
					stage: "daily-call-join",
					status: "started",
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				});
				const joinStartTime = Date.now();
				recordingRequestedTime = joinStartTime;
				try {
					await this.call.join({
						url: webCall.webCallUrl,
						...callToken ? { token: callToken } : {},
						subscribeToTracksAutomatically: false
					});
					const joinDuration = Date.now() - joinStartTime;
					this.emit("call-start-progress", {
						stage: "daily-call-join",
						status: "completed",
						duration: joinDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
				} catch (error) {
					const joinDuration = Date.now() - joinStartTime;
					const serializedError = serializeError(error);
					this.emit("call-start-progress", {
						stage: "daily-call-join",
						status: "failed",
						duration: joinDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString(),
						metadata: { error: serializedError.message }
					});
					this.emit("error", {
						type: "daily-call-join-error",
						stage: "daily-call-join",
						error: serializedError,
						duration: joinDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
					throw error;
				}
				if (isVideoRecordingEnabled && callToken) this.emit("call-start-progress", {
					stage: "video-recording-setup",
					status: "completed",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					metadata: { action: isRecordingStartedByServer ? "started-by-server" : "auto-started-via-meeting-token" }
				});
				else if (isVideoRecordingEnabled) this.emit("call-start-progress", {
					stage: "video-recording-setup",
					status: "failed",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					metadata: { action: "no-meeting-token" }
				});
				else this.emit("call-start-progress", {
					stage: "video-recording-setup",
					status: "completed",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					metadata: { action: "skipped-not-enabled" }
				});
				this.emit("call-start-progress", {
					stage: "audio-observer-setup",
					status: "started",
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				});
				const audioObserverStartTime = Date.now();
				try {
					this.call.startRemoteParticipantsAudioLevelObserver(100);
					const audioObserverDuration = Date.now() - audioObserverStartTime;
					this.emit("call-start-progress", {
						stage: "audio-observer-setup",
						status: "completed",
						duration: audioObserverDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
				} catch (error) {
					const audioObserverDuration = Date.now() - audioObserverStartTime;
					const serializedError = serializeError(error);
					this.emit("call-start-progress", {
						stage: "audio-observer-setup",
						status: "failed",
						duration: audioObserverDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString(),
						metadata: { error: serializedError.message }
					});
					this.emit("error", {
						type: "audio-observer-setup-error",
						stage: "audio-observer-setup",
						error: serializedError,
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
				}
				this.call.on("remote-participants-audio-level", (e) => {
					if (e) this.handleRemoteParticipantsAudioLevel(e);
				});
				this.call.on("local-audio-level", (e) => {
					if (e) this.handleLocalAudioLevel(e);
				});
				this.call.on("nonfatal-error", (e) => {
					if (e?.type === "local-audio-level-observer-error") this.emit("local-audio-level-observer-error", serializeError(e));
					if (e?.type === "audio-processor-error") this.call?.updateInputSettings({ audio: { processor: { type: "none" } } }).then(() => {
						(0, daily_guards_1.safeSetLocalAudio)(this.call, true);
					}).catch((error) => {
						this.emitAudioProcessingError("audio-processor-recovery", error);
					});
				});
				this.emit("call-start-progress", {
					stage: "audio-processing-setup",
					status: "started",
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				});
				const audioProcessingStartTime = Date.now();
				try {
					const audioProcessingUpdate = this.call.updateInputSettings({ audio: { processor: { type: "noise-cancellation" } } });
					audioProcessingUpdate.catch((error) => {
						this.emitAudioProcessingError("audio-processing-setup", error);
					});
					audioProcessingUpdate.catch(() => {}).then(() => this.maybeStartLocalAudioLevelObserver());
					const audioProcessingDuration = Date.now() - audioProcessingStartTime;
					this.emit("call-start-progress", {
						stage: "audio-processing-setup",
						status: "completed",
						duration: audioProcessingDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
				} catch (error) {
					const audioProcessingDuration = Date.now() - audioProcessingStartTime;
					const serializedError = serializeError(error);
					this.emit("call-start-progress", {
						stage: "audio-processing-setup",
						status: "failed",
						duration: audioProcessingDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString(),
						metadata: { error: serializedError.message }
					});
					this.emit("error", {
						type: "audio-processing-setup-error",
						stage: "audio-processing-setup",
						error: serializedError,
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
				}
				const totalDuration = Date.now() - startTime;
				this.emit("call-start-success", {
					totalDuration,
					callId: webCall?.id || "unknown",
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				});
				if (recordingTokenMissing) this.recordingTokenMissingReportSchedule();
				return webCall;
			} catch (e) {
				const totalDuration = Date.now() - startTime;
				const serializedError = serializeError(e);
				await this.cleanup();
				this.emit("call-start-failed", {
					stage: failureStage,
					totalDuration,
					error: serializedError.message,
					errorStack: serializedError.stack || "No stack trace available",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					context: {
						hasAssistant: !!assistant,
						hasSquad: !!squad,
						hasWorkflow: !!workflow,
						isMobile: this.isMobileDevice()
					}
				});
				this.emit("error", {
					type: failureStage === "microphone-preflight" ? `microphone-preflight-${e && typeof e === "object" && "name" in e ? e.name : "error"}` : "start-method-error",
					stage: failureStage,
					error: serializedError,
					totalDuration,
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					context: {
						hasAssistant: !!assistant,
						hasSquad: !!squad,
						hasWorkflow: !!workflow,
						isMobile: this.isMobileDevice()
					}
				});
				return null;
			}
		}
		onAppMessage(e) {
			if (!e) return;
			try {
				if (e.data === "listening") return this.emit("call-start");
				else try {
					const parsedMessage = JSON.parse(e.data);
					if (parsedMessage?.type === VIDEO_RECORDING_START_FAILED_MESSAGE_TYPE) {
						this.videoRecordingStartFailedReport(parsedMessage);
						return;
					}
					this.emit("message", parsedMessage);
					if (parsedMessage && "type" in parsedMessage && "status" in parsedMessage && parsedMessage.type === "status-update" && parsedMessage.status === "ended") this.hasEmittedCallEndedStatus = true;
				} catch (parseError) {
					console.log("Error parsing message data: ", parseError);
				}
			} catch (e) {
				console.error(e);
			}
		}
		handleRemoteParticipantsAudioLevel(e) {
			const speechLevel = Object.values(e.participantsAudioLevel).reduce((a, b) => a + b, 0);
			this.emit("volume-level", Math.min(1, speechLevel / .15));
			if (!(speechLevel > .01)) return;
			if (this.speakingTimeout) {
				clearTimeout(this.speakingTimeout);
				this.speakingTimeout = null;
			} else this.emit("speech-start");
			this.speakingTimeout = setTimeout(() => {
				this.emit("speech-end");
				this.speakingTimeout = null;
			}, 1e3);
		}
		handleLocalAudioLevel(e) {
			this.emit("local-volume-level", e.audioLevel);
		}
		/**
		* Stops the call by destroying the Daily call object.
		*
		* If `roomDeleteOnUserLeaveEnabled` is set to `false`, the Vapi call will be kept alive, allowing reconnections to the same call using the `reconnect` method.
		* If `roomDeleteOnUserLeaveEnabled` is set to `true`, the Vapi call will also be destroyed, preventing any reconnections.
		*/
		async stop() {
			if (this.cancelMicrophonePreflight) {
				this.cancelMicrophonePreflight();
				return;
			}
			this.microphoneTrack?.stop();
			this.microphoneTrack = null;
			this.started = false;
			if (this.call) {
				await this.call.destroy();
				this.call = null;
			}
			this.audioPlayer = null;
			this.pendingAudioBuilds.clear();
			this.speakingTimeout = null;
		}
		/**
		* Sends a Live Call Control message to the Vapi server.
		*
		* Docs: https://docs.vapi.ai/calls/call-features
		*/
		send(message) {
			this.call?.sendAppMessage(JSON.stringify(message));
		}
		/**
		* The two places this class touches the DOM, behind indirections so the
		* lifecycle logic around them is testable without a browser.
		*/
		audioPlayerBuild(track, participantId, volume) {
			return buildAudioPlayer(track, participantId, volume);
		}
		audioPlayerDestroy(participantId) {
			destroyAudioPlayer(participantId);
		}
		/**
		* The remembered volume, bounded, or null if there is nothing to apply.
		* Shared by both callers so they cannot disagree: the DOM throws on a
		* non-finite or out-of-range volume, and that throw would stall the call.
		*/
		desiredVolumeResolve() {
			if (this.desiredVolume === null || !Number.isFinite(this.desiredVolume)) return null;
			return Math.min(1, Math.max(0, this.desiredVolume));
		}
		/** Shared by the initial and reconnect paths so the two cannot drift. */
		async handleTrackStarted(e) {
			if (!e || !e.participant) return;
			if (e.participant?.local) return;
			if (e.participant?.user_name !== "Vapi Speaker") return;
			if (e.track.kind === "video") this.emitToConsumer("video", e.track);
			if (e.track.kind === "audio") {
				const call = this.call;
				const build = ++this.audioBuildSequence;
				this.pendingAudioBuilds.set(build, e.participant.session_id);
				let player;
				try {
					player = await this.audioPlayerBuild(e.track, e.participant.session_id, this.desiredVolumeResolve());
				} catch (error) {
					this.pendingAudioBuilds.delete(build);
					console.error("[vapi] could not start assistant audio", error);
					this.emitToConsumer("error", {
						type: "audio-start-failed",
						error: serializeError(error)
					});
					return;
				}
				const stillPending = this.pendingAudioBuilds.delete(build);
				if (!call || this.call !== call || !stillPending || build < this.attachedAudioBuild) {
					player.remove();
					return;
				}
				this.attachedAudioBuild = build;
				this.attachAudioPlayer(player);
			}
			this.call?.sendAppMessage("playable");
		}
		/**
		* Assigns before emitting, since emit is synchronous and a listener may call
		* getAudioPlayer or setVolume during the event.
		*/
		attachAudioPlayer(player) {
			if (this.audioPlayer && this.audioPlayer !== player) this.audioPlayer.remove();
			const volume = this.desiredVolumeResolve();
			if (volume !== null) player.volume = volume;
			this.audioPlayer = player;
			this.emitToConsumer("audio", player);
		}
		/**
		* A listener that throws must not take down the caller: track-started still
		* has to signal that playback is ready. Not routed to the `error` event,
		* which EventEmitter throws on when nothing is listening.
		*/
		emitToConsumer(event, ...args) {
			try {
				this.emit(event, ...args);
			} catch (error) {
				console.error(`[vapi] ${event} event listener threw`, error);
			}
		}
		/**
		* Reported in a later task, like Daily's own recording-error: start() or
		* reconnect() has resolved and the caller's await continuation has run, so a
		* listener registered right after it still hears this, and one that calls
		* stop() can't interrupt call setup. Skipped if that call was stopped or
		* replaced.
		*/
		recordingTokenMissingReportSchedule() {
			const call = this.call;
			if (!call) return;
			setTimeout(() => {
				if (!this.started || this.call !== call) return;
				this.emitToConsumer("recording-error", {
					action: "recording-error",
					callClientId: call.callClientId,
					errorMsg: "Vapi returned no recording token, so the recording was not started. Call startRecording() to try starting it from the client."
				});
			}, 0);
		}
		/** The fields are read defensively: the app message is untrusted JSON. */
		videoRecordingStartFailedReport(message) {
			const outcome = typeof message.outcome === "string" ? message.outcome : "unknown";
			const error = typeof message.error === "string" ? message.error : "unknown";
			this.emitToConsumer("recording-error", {
				action: "recording-error",
				callClientId: this.call?.callClientId ?? "",
				errorMsg: `Vapi couldn't start the recording (${outcome}): ${error}`
			});
		}
		/** Drops the reference before removing, so nothing hands out a detached element. */
		detachAudioPlayer(participantId) {
			if (this.audioPlayer?.dataset.participantId === participantId) this.audioPlayer = null;
			for (const [build, id] of this.pendingAudioBuilds) if (id === participantId) this.pendingAudioBuilds.delete(build);
			this.audioPlayerDestroy(participantId);
		}
		/**
		* The <audio> element playing the assistant, or null before its track has
		* arrived. Pair with the `audio` event when you need it the moment it exists.
		*/
		getAudioPlayer() {
			return this.audioPlayer;
		}
		/**
		* Sets assistant playback volume, 0 to 1.
		*
		* The setting is remembered, so it can be applied before the assistant's
		* audio track has arrived and it survives across calls and mid-call track
		* replacement. Callers do not have to race the start of the call.
		*
		* Values outside 0 to 1 are clamped and non-finite values are ignored, since
		* the DOM rejects both rather than saturating.
		*
		* Only volume set through this method is remembered. Writing `volume`
		* directly on the element from getAudioPlayer() or the `audio` event applies
		* to that element alone, and is overwritten the next time one is attached.
		*
		* This is playback only. It does not change what the assistant hears, and it
		* does not affect the levels reported by the `volume-level` event.
		*/
		setVolume(volume) {
			if (!Number.isFinite(volume)) return;
			this.desiredVolume = Math.min(1, Math.max(0, volume));
			if (this.audioPlayer) this.audioPlayer.volume = this.desiredVolume;
		}
		setMuted(mute) {
			(0, daily_guards_1.safeSetLocalAudio)(this.call, !mute);
		}
		isMuted() {
			if (!this.call) return false;
			return this.call.localAudio() === false;
		}
		say(message, endCallAfterSpoken, interruptionsEnabled, interruptAssistantEnabled) {
			this.send({
				type: "say",
				message,
				endCallAfterSpoken,
				interruptionsEnabled: interruptionsEnabled ?? false,
				interruptAssistantEnabled: interruptAssistantEnabled ?? false
			});
		}
		/**
		* Ends the call immediately by sending a `end-call` message using Live Call Control, and destroys the Daily call object.
		*
		* This method always ends the call, regardless of the `roomDeleteOnUserLeaveEnabled` option.
		*/
		end() {
			this.send({ type: "end-call" });
			this.stop();
		}
		setInputDevicesAsync(options) {
			return (0, daily_guards_1.safeSetInputDevicesAsync)(this.call, options);
		}
		async increaseMicLevel(gain) {
			if (!this.call) throw new Error("Call object is not available.");
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
				const audioContext = new AudioContext();
				const source = audioContext.createMediaStreamSource(stream);
				const gainNode = audioContext.createGain();
				gainNode.gain.value = gain;
				source.connect(gainNode);
				const destination = audioContext.createMediaStreamDestination();
				gainNode.connect(destination);
				const [boostedTrack] = destination.stream.getAudioTracks();
				await (0, daily_guards_1.safeSetInputDevicesAsync)(this.call, { audioSource: boostedTrack });
			} catch (error) {
				console.error("Error adjusting microphone level:", error);
			}
		}
		setOutputDeviceAsync(options) {
			this.call?.setOutputDeviceAsync(options);
		}
		getDailyCallObject() {
			return this.call;
		}
		/**
		* Returns the most recent local (microphone) audio level, a number between 0 and 1.
		*
		* Useful for detecting when the local participant's microphone is not picking up any
		* audio (e.g. wrong input device selected, OS-level input volume at 0, or muted
		* hardware) so you can surface a "we can't hear you" style warning in your UI.
		*
		* Returns 0 when there is no active call.
		*/
		getLocalAudioLevel() {
			if (!this.call) return 0;
			return this.call.getLocalAudioLevel();
		}
		/**
		* Starts (or restarts) the local audio level observer. The observer is started
		* automatically when a call begins, but this can be used to change the sampling
		* interval or restart it if it was stopped.
		*
		* While running, the Vapi instance emits 'local-volume-level' events with the local
		* microphone audio level (0 to 1).
		*
		* @param interval How often, in milliseconds, to emit audio level events. Defaults to Daily's default.
		*/
		async startLocalAudioLevelObserver(interval) {
			if (!this.call) throw new Error("Call object is not available.");
			await this.call.startLocalAudioLevelObserver(interval);
		}
		/**
		* Stops the local audio level observer. After calling this, 'local-volume-level'
		* events will no longer be emitted until the observer is started again.
		*/
		stopLocalAudioLevelObserver() {
			this.call?.stopLocalAudioLevelObserver();
		}
		/**
		* Returns whether the local audio level observer is currently running.
		*/
		isLocalAudioLevelObserverRunning() {
			if (!this.call) return false;
			return this.call.isLocalAudioLevelObserverRunning();
		}
		startScreenSharing(displayMediaOptions, screenVideoSendSettings) {
			this.call?.startScreenShare({
				displayMediaOptions,
				screenVideoSendSettings
			});
		}
		stopScreenSharing() {
			this.call?.stopScreenShare();
		}
		/**
		* Starts (or retries) a cloud recording of the call.
		*
		* Recording start is asynchronous: success is signaled by the
		* 'recording-started' event and failure by 'recording-error'. Daily does not
		* retry automatically, so if you receive 'recording-error' (e.g. the
		* recording start timed out), you can call this method again a few seconds
		* later to retry.
		*/
		startRecording() {
			if (!this.call) throw new Error("Call object is not available.");
			this.call.startRecording({
				width: 1280,
				height: 720,
				backgroundColor: "#FF1F2D3D",
				layout: { preset: "default" }
			});
		}
		/**
		* Stops the in-progress recording. Completion is signaled by the
		* 'recording-stopped' event.
		*/
		stopRecording() {
			this.call?.stopRecording();
		}
		/**
		* Reconnects to an active call.
		*
		*
		* @param webCall
		*/
		async reconnect(webCall) {
			const startTime = Date.now();
			if (this.started) throw new Error("Cannot reconnect while a call is already in progress. Call stop() first.");
			if (!webCall.webCallUrl) throw new Error("webCallUrl is required for reconnection.");
			this.emit("call-start-progress", {
				stage: "reconnect-initialization",
				status: "started",
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				metadata: {
					callId: webCall.id || "unknown",
					hasVideoRecording: !!webCall?.artifactPlan?.videoRecordingEnabled,
					voiceProvider: webCall?.assistant?.voice?.provider || "unknown"
				}
			});
			this.started = true;
			try {
				if (this.call) {
					this.emit("call-start-progress", {
						stage: "cleanup-existing-call",
						status: "started",
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
					await this.cleanup();
					this.emit("call-start-progress", {
						stage: "cleanup-existing-call",
						status: "completed",
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
				}
				const isVideoRecordingEnabled = webCall?.artifactPlan?.videoRecordingEnabled ?? false;
				const callToken = webCall?.transport?.callToken;
				const isRecordingStartedByServer = webCall?.transport?.videoRecordingStartMode === "server";
				const recordingTokenMissing = isVideoRecordingEnabled && !callToken;
				this.emit("call-start-progress", {
					stage: "daily-call-object-creation",
					status: "started",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					metadata: {
						audioSource: this.dailyCallObject.audioSource ?? true,
						videoSource: this.dailyCallObject.videoSource ?? isVideoRecordingEnabled,
						isVideoRecordingEnabled
					}
				});
				const dailyCallStartTime = Date.now();
				this.call = daily_js_1.default.createCallObject({
					audioSource: this.dailyCallObject.audioSource ?? true,
					videoSource: this.dailyCallObject.videoSource ?? isVideoRecordingEnabled,
					dailyConfig: this.dailyCallConfig
				});
				const dailyCallDuration = Date.now() - dailyCallStartTime;
				this.emit("call-start-progress", {
					stage: "daily-call-object-creation",
					status: "completed",
					duration: dailyCallDuration,
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				});
				this.call.iframe()?.style.setProperty("display", "none");
				this.call.on("left-meeting", () => {
					this.emit("call-end");
					if (!this.hasEmittedCallEndedStatus) {
						this.emit("message", {
							type: "status-update",
							status: "ended",
							"endedReason": "customer-ended-call"
						});
						this.hasEmittedCallEndedStatus = true;
					}
					if (isVideoRecordingEnabled) this.call?.stopRecording();
					this.cleanup().catch(console.error);
				});
				this.call.on("error", (error) => {
					this.emit("error", {
						type: "daily-error",
						error: serializeError(error),
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
					if (isVideoRecordingEnabled) this.call?.stopRecording();
				});
				this.call.on("camera-error", (error) => {
					this.emit("camera-error", {
						type: "camera-error",
						error: serializeError(error),
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
				});
				this.call.on("network-quality-change", (event) => {
					this.emit("network-quality-change", event);
				});
				this.call.on("network-connection", (event) => {
					this.emit("network-connection", event);
				});
				this.call.on("recording-started", (event) => {
					if (event) this.emit("recording-started", event);
				});
				this.call.on("recording-stopped", (event) => {
					if (event) this.emit("recording-stopped", event);
				});
				this.call.on("recording-stats", (event) => {
					if (event) this.emit("recording-stats", event);
				});
				this.call.on("recording-error", (event) => {
					if (event) this.emit("recording-error", event);
				});
				this.call.on("recording-upload-completed", (event) => {
					if (event) this.emit("recording-upload-completed", event);
				});
				this.call.on("track-started", (e) => this.handleTrackStarted(e));
				this.call.on("participant-joined", (e) => {
					if (!e || !this.call) return;
					subscribeToTracks(e, this.call, isVideoRecordingEnabled);
				});
				this.call.on("participant-updated", (e) => {
					if (!e) return;
					this.emit("daily-participant-updated", e.participant);
				});
				this.call.on("participant-left", (e) => {
					if (!e) return;
					this.detachAudioPlayer(e.participant.session_id);
				});
				this.call.on("remote-participants-audio-level", (e) => {
					if (e) this.handleRemoteParticipantsAudioLevel(e);
				});
				this.call.on("local-audio-level", (e) => {
					if (e) this.handleLocalAudioLevel(e);
				});
				this.call.on("app-message", (e) => this.onAppMessage(e));
				this.call.on("nonfatal-error", (e) => {
					if (e?.type === "local-audio-level-observer-error") this.emit("local-audio-level-observer-error", serializeError(e));
					if (e?.type === "audio-processor-error") this.call?.updateInputSettings({ audio: { processor: { type: "none" } } }).then(() => {
						(0, daily_guards_1.safeSetLocalAudio)(this.call, true);
					}).catch((error) => {
						this.emitAudioProcessingError("audio-processor-recovery", error);
					});
				});
				let recordingRequestedTime = 0;
				if (isVideoRecordingEnabled) this.call.once("recording-started", () => {
					const totalRecordingDelay = ((/* @__PURE__ */ new Date()).getTime() - recordingRequestedTime) / 1e3;
					this.emit("call-start-progress", {
						stage: "video-recording-started",
						status: "completed",
						timestamp: (/* @__PURE__ */ new Date()).toISOString(),
						metadata: { delaySeconds: totalRecordingDelay }
					});
					this.send({
						type: "control",
						control: "say-first-message",
						videoRecordingStartDelaySeconds: totalRecordingDelay
					});
				});
				const isMobile = this.isMobileDevice();
				this.emit("call-start-progress", {
					stage: "mobile-permissions",
					status: "started",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					metadata: { isMobile }
				});
				if (isMobile) {
					const mobileWaitStartTime = Date.now();
					await this.sleep(1e3);
					const mobileWaitDuration = Date.now() - mobileWaitStartTime;
					this.emit("call-start-progress", {
						stage: "mobile-permissions",
						status: "completed",
						duration: mobileWaitDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString(),
						metadata: { action: "permissions-wait" }
					});
				} else this.emit("call-start-progress", {
					stage: "mobile-permissions",
					status: "completed",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					metadata: { action: "skipped-not-mobile" }
				});
				this.emit("call-start-progress", {
					stage: "daily-call-join",
					status: "started",
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				});
				const joinStartTime = Date.now();
				recordingRequestedTime = joinStartTime;
				await this.call.join({
					url: webCall.webCallUrl,
					...callToken ? { token: callToken } : {},
					subscribeToTracksAutomatically: false
				});
				const joinDuration = Date.now() - joinStartTime;
				this.emit("call-start-progress", {
					stage: "daily-call-join",
					status: "completed",
					duration: joinDuration,
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				});
				if (isVideoRecordingEnabled && callToken) this.emit("call-start-progress", {
					stage: "video-recording-setup",
					status: "completed",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					metadata: { action: isRecordingStartedByServer ? "started-by-server" : "auto-started-via-meeting-token" }
				});
				else if (isVideoRecordingEnabled) this.emit("call-start-progress", {
					stage: "video-recording-setup",
					status: "failed",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					metadata: { action: "no-meeting-token" }
				});
				else this.emit("call-start-progress", {
					stage: "video-recording-setup",
					status: "completed",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					metadata: { action: "skipped-not-enabled" }
				});
				this.emit("call-start-progress", {
					stage: "audio-observer-setup",
					status: "started",
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				});
				const audioObserverStartTime = Date.now();
				try {
					this.call.startRemoteParticipantsAudioLevelObserver(100);
					const audioObserverDuration = Date.now() - audioObserverStartTime;
					this.emit("call-start-progress", {
						stage: "audio-observer-setup",
						status: "completed",
						duration: audioObserverDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
				} catch (error) {
					const audioObserverDuration = Date.now() - audioObserverStartTime;
					const serializedError = serializeError(error);
					this.emit("call-start-progress", {
						stage: "audio-observer-setup",
						status: "failed",
						duration: audioObserverDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString(),
						metadata: { error: serializedError.message }
					});
				}
				this.emit("call-start-progress", {
					stage: "audio-processing-setup",
					status: "started",
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				});
				const audioProcessingStartTime = Date.now();
				try {
					const audioProcessingUpdate = this.call.updateInputSettings({ audio: { processor: { type: "noise-cancellation" } } });
					audioProcessingUpdate.catch((error) => {
						this.emitAudioProcessingError("audio-processing-setup", error);
					});
					audioProcessingUpdate.catch(() => {}).then(() => this.maybeStartLocalAudioLevelObserver());
					const audioProcessingDuration = Date.now() - audioProcessingStartTime;
					this.emit("call-start-progress", {
						stage: "audio-processing-setup",
						status: "completed",
						duration: audioProcessingDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString()
					});
				} catch (error) {
					const audioProcessingDuration = Date.now() - audioProcessingStartTime;
					const serializedError = serializeError(error);
					this.emit("call-start-progress", {
						stage: "audio-processing-setup",
						status: "failed",
						duration: audioProcessingDuration,
						timestamp: (/* @__PURE__ */ new Date()).toISOString(),
						metadata: { error: serializedError.message }
					});
				}
				const totalDuration = Date.now() - startTime;
				this.emit("call-start-success", {
					totalDuration,
					callId: webCall?.id || "unknown",
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				});
				this.emit("call-start");
				if (recordingTokenMissing) this.recordingTokenMissingReportSchedule();
			} catch (e) {
				const totalDuration = Date.now() - startTime;
				const serializedError = serializeError(e);
				this.emit("call-start-failed", {
					stage: "reconnect",
					totalDuration,
					error: serializedError.message,
					errorStack: serializedError.stack || "No stack trace available",
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					context: {
						isReconnect: true,
						callId: webCall?.id || "unknown",
						hasVideoRecording: !!webCall?.artifactPlan?.videoRecordingEnabled,
						voiceProvider: webCall?.assistant?.voice?.provider || "unknown",
						isMobile: this.isMobileDevice()
					}
				});
				this.emit("error", {
					type: "reconnect-error",
					error: serializedError,
					totalDuration,
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					context: {
						isReconnect: true,
						callId: webCall?.id || "unknown",
						hasVideoRecording: !!webCall?.artifactPlan?.videoRecordingEnabled,
						voiceProvider: webCall?.assistant?.voice?.provider || "unknown",
						isMobile: this.isMobileDevice()
					}
				});
				await this.cleanup();
				throw e;
			}
		}
		/**
		* Runs all network connectivity tests for pre-call diagnostics.
		* Creates a temporary Daily call object for testing purposes.
		*
		* Tests performed:
		* 1. Network connectivity (TURN server) - Tests if traffic can be relayed through TURN servers
		* 2. Websocket connectivity - Tests if websocket connections can be established
		* 3. Call quality - Tests overall call quality metrics (if available in SDK version)
		*
		* @returns {Promise<Record<string, any>>} Test results object with status for each test
		*
		* @example
		* // Run pre-call network diagnostics
		* const results = await Vapi.runNetworkTestsStandalone();
		* if (results.networkConnectivity?.result === 'failed') {
		*   console.warn('Network issues detected - calls may not work properly');
		* }
		*
		* @static
		*/
		static async runNetworkTestsStandalone() {
			console.log("Starting standalone network connectivity tests...");
			const results = {};
			let tempCall = null;
			try {
				console.log("Creating temporary call object for testing...");
				tempCall = daily_js_1.default.createCallObject({
					audioSource: true,
					videoSource: true
				});
				console.log("\n1. Testing network connectivity (TURN server)...");
				let videoTrack = null;
				try {
					videoTrack = (await navigator.mediaDevices.getUserMedia({ video: true })).getVideoTracks()[0];
					const networkTest = await tempCall.testNetworkConnectivity(videoTrack);
					results.networkConnectivity = networkTest;
					console.log("Network connectivity test result:", networkTest);
				} catch (error) {
					results.networkConnectivity = {
						result: "error",
						error: error?.toString()
					};
					console.error("Network connectivity test error:", error);
				} finally {
					if (videoTrack) videoTrack.stop();
				}
				console.log("\n2. Testing websocket connectivity...");
				try {
					const websocketTest = await tempCall.testWebsocketConnectivity();
					results.websocketConnectivity = websocketTest;
					console.log("Websocket connectivity test result:", websocketTest);
				} catch (error) {
					results.websocketConnectivity = {
						result: "error",
						error: error?.toString()
					};
					console.error("Websocket connectivity test error:", error);
				}
				console.log("\n3. Testing call quality...");
				try {
					if (typeof tempCall.testCallQuality === "function") try {
						console.log("Initializing call state with startCamera...");
						await tempCall.startCamera();
						const callQualityTest = await tempCall.testCallQuality();
						results.callQuality = callQualityTest;
						console.log("Call quality test result:", callQualityTest);
					} catch (startCameraError) {
						console.error("Failed to start camera for call quality test:", startCameraError);
						results.callQuality = {
							result: "error",
							error: startCameraError?.toString(),
							message: "Failed to initialize camera for call quality test. Check camera permissions."
						};
					}
					else {
						results.callQuality = {
							result: "not-available",
							message: "testCallQuality method not available"
						};
						console.log("Call quality test not available in current Daily.co version");
					}
				} catch (error) {
					results.callQuality = {
						result: "error",
						error: error?.toString()
					};
					console.error("Call quality test error:", error);
				}
			} catch (error) {
				console.error("Failed to create temporary call object:", error);
				results.error = error?.toString();
			} finally {
				if (tempCall) try {
					console.log("Cleaning up temporary call object...");
					await tempCall.destroy();
				} catch (error) {
					console.error("Error destroying temporary call object:", error);
				}
			}
			console.log("\n=== Network Test Summary ===");
			console.log("Results:", JSON.stringify(results, null, 2));
			return results;
		}
	};
	exports.default = Vapi;
}));
//#endregion
export { require_vapi as t };
