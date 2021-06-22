"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const core_1 = require("@apollo/client/core");
const queries_1 = require("./queries");
class API {
    constructor(_a) {
        var { token } = _a, rest = __rest(_a, ["token"]);
        this.owner = rest.owner;
        this.name = rest.name;
        this.client = new core_1.ApolloClient({
            cache: new core_1.InMemoryCache(),
            link: new core_1.HttpLink({
                uri: 'https://api.github.com/graphql',
                fetch: cross_fetch_1.default,
                headers: {
                    authorization: `bearer ${token}`
                }
            })
        });
    }
    findRepository() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.query({
                query: queries_1.GET_REPOSITORY,
                variables: { owner: this.owner, name: this.name }
            });
            if (res.errors) {
                throw new core_1.ApolloError({ graphQLErrors: res.errors });
            }
            return res.data.repository;
        });
    }
    /**
     * Finds a branch protection by its pattern.
     *
     * @param repository
     * @param pattern
     */
    extractBranchProtectionRuleByPattern(repository, pattern) {
        var _a, _b;
        return (((_b = (_a = repository === null || repository === void 0 ? void 0 : repository.branchProtectionRules.edges) === null || _a === void 0 ? void 0 : _a.find(item => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.node) === null || _a === void 0 ? void 0 : _a.pattern) === pattern; })) === null || _b === void 0 ? void 0 : _b.node) || null);
    }
    /**
     * Creates a new branch protection rule.
     *
     * @param repositoryId The unique repository identifier
     * @param pattern The branch protection pattern
     * @param rule The actual ruleset.
     */
    createBranchProtectionRule(repository, pattern, _a) {
        var _b, _c;
        var { pushActors, reviewDismissalActors } = _a, rule = __rest(_a, ["pushActors", "reviewDismissalActors"]);
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.mutate({
                mutation: queries_1.CREATE_BRANCH_PROTECTION_RULE,
                variables: {
                    input: Object.assign(Object.assign({ pattern, repositoryId: repository.id }, rule), { pushActorIds: pushActors && pushActors.length > 0
                            ? yield this.resolveActors(this.getOrganizationHandle(repository), pushActors)
                            : undefined, reviewDismissalActorIds: reviewDismissalActors && reviewDismissalActors.length > 0
                            ? yield this.resolveActors(this.getOrganizationHandle(repository), reviewDismissalActors)
                            : undefined })
                }
            });
            if (res.errors) {
                throw new core_1.ApolloError({ graphQLErrors: res.errors });
            }
            const branchProtectionRule = ((_c = (_b = res.data) === null || _b === void 0 ? void 0 : _b.createBranchProtectionRule) === null || _c === void 0 ? void 0 : _c.branchProtectionRule) || null;
            if (!branchProtectionRule) {
                throw new Error('unable to read the branchProtectionRule');
            }
            return branchProtectionRule;
        });
    }
    /**
     * Updates a branch protection rule.
     *
     * @param id the unique identifier of the branch protection rule
     * @param spec the new specification
     */
    updateBranchProtectionRuleByID(repository, id, _a) {
        var _b, _c;
        var { pushActors, reviewDismissalActors } = _a, rule = __rest(_a, ["pushActors", "reviewDismissalActors"]);
        return __awaiter(this, void 0, void 0, function* () {
            const input = Object.assign({ branchProtectionRuleId: id }, rule);
            if (pushActors && pushActors.length > 0) {
                input.pushActorIds = yield this.resolveActors(this.getOrganizationHandle(repository), pushActors);
            }
            if (reviewDismissalActors && reviewDismissalActors.length > 0) {
                input.reviewDismissalActorIds = yield this.resolveActors(this.getOrganizationHandle(repository), reviewDismissalActors);
            }
            const res = yield this.client.mutate({
                mutation: queries_1.UPDATE_BRANCH_PROTECTION_RULE,
                variables: {
                    input
                }
            });
            if (res.errors) {
                throw new core_1.ApolloError({ graphQLErrors: res.errors });
            }
            const branchProtectionRule = ((_c = (_b = res.data) === null || _b === void 0 ? void 0 : _b.updateBranchProtectionRule) === null || _c === void 0 ? void 0 : _c.branchProtectionRule) || null;
            if (!branchProtectionRule) {
                throw new Error('unable to read the branchProtectionRule');
            }
            return branchProtectionRule;
        });
    }
    /**
     * Deletes a branch protection.
     *
     * @param id the unique identifier of the branch protection rule
     */
    deleteBranchProtectionRuleByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.mutate({
                mutation: queries_1.DELETE_BRANCH_PROTECTION_RULE,
                variables: {
                    id
                }
            });
            if (res.errors) {
                throw new core_1.ApolloError({ graphQLErrors: res.errors });
            }
            return true;
        });
    }
    findActorUser(handle) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.query({
                query: queries_1.GET_ACTOR_USER,
                variables: { handle }
            });
            if (res.errors) {
                throw new core_1.ApolloError({ graphQLErrors: res.errors });
            }
            return res.data.user || null;
        });
    }
    findActorTeam(handle, slug) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.query({
                query: queries_1.GET_ACTOR_TEAM,
                variables: { handle, slug }
            });
            if (res.errors) {
                throw new core_1.ApolloError({ graphQLErrors: res.errors });
            }
            return ((_a = res.data.organization) === null || _a === void 0 ? void 0 : _a.team) || null;
        });
    }
    resolveActors(organization, actors) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            const queries = actors.map(actor => {
                if (actor.startsWith('@')) {
                    // eslint-disable-next-line github/no-then
                    return this.findActorUser(actor.substr(1)).then(maybeUser => {
                        if (maybeUser) {
                            return maybeUser.id;
                        }
                        return Promise.reject(new Error(`unable to find actor ${actor}`));
                    });
                }
                if (actor.startsWith('#')) {
                    if (organization !== null) {
                        // eslint-disable-next-line github/no-then
                        return this.findActorTeam(organization, actor.substr(1)).then(maybeTeam => {
                            if (maybeTeam) {
                                return maybeTeam.id;
                            }
                            return Promise.reject(new Error(`unable to find actor ${actor}`));
                        });
                    }
                    return Promise.reject(new Error(`Unable to query teams outside of an orgnaization (${actor.substr(1)})`));
                }
                return Promise.reject(new Error(`Invalid actor ${actor} obtained`));
            });
            return Promise.all(queries);
        });
    }
    getOrganizationHandle(repository) {
        if (repository.owner.__typename === 'Organization') {
            return repository.owner.organizationHandle;
        }
        return null;
    }
}
exports.default = API;
