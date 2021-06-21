"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const environment = __importStar(require("./environment"));
const config = __importStar(require("./config"));
const API_1 = __importDefault(require("./API"));
const config_1 = require("./config");
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (typeof environment.token !== 'string' ||
                environment.token.length === 0) {
                throw new Error('Valid token required');
            }
            if (environment.branch.length === 0) {
                throw new Error('Unable to determine search pattern');
            }
            if (environment.owner.length === 0 || environment.name.length === 0) {
                throw new Error('Unable to determine the actual repository name');
            }
            const specification = yield config.load(core.getInput('config'));
            const api = new API_1.default({
                token: environment.token,
                owner: environment.owner,
                name: environment.name
            });
            const repository = yield api.findRepository();
            if (!repository) {
                throw new Error(`Cannot find repository ${environment.owner}/${environment.name}`);
            }
            const branchProtection = api.extractBranchProtectionRuleByPattern(repository, environment.branch);
            const current = config.translate(branchProtection);
            const desired = config_1.extractByPattern(specification, environment.branch);
            if (!((_a = specification.patterns) === null || _a === void 0 ? void 0 : _a.includes(environment.branch)) &&
                branchProtection !== null) {
                core.info(`deleting branch protection rule for ${environment.branch} (${branchProtection.id})`);
                yield api.deleteBranchProtectionRuleByID(branchProtection.id);
            }
            else if (branchProtection !== null &&
                current !== null &&
                desired !== null) {
                const patch = config_1.diff(current, desired);
                if (patch !== null) {
                    core.info(`updating the branch protection ${environment.branch} to ${JSON.stringify(patch)}`);
                    yield api.updateBranchProtectionRuleByID(repository, branchProtection.id, patch);
                }
                else {
                    core.info(`nothing to change on ${environment.branch}`);
                }
            }
            else if (current === null && desired !== null) {
                yield api.createBranchProtectionRule(repository, environment.branch, desired);
                core.info(`created a new branch protection for ${environment.branch} (${JSON.stringify(desired)})`);
            }
            core.info('completed');
        }
        catch (err) {
            if (err instanceof Error) {
                core.debug(err.stack || err.message);
            }
            core.setFailed(err.message);
        }
    });
}
run();
