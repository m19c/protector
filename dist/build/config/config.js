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
exports.diff = exports.extractByPattern = exports.translate = exports.load = void 0;
const fs_1 = require("fs");
const util_1 = require("util");
const deepmerge_1 = __importDefault(require("deepmerge"));
const lodash_clone_1 = __importDefault(require("lodash.clone"));
const yaml_1 = __importDefault(require("yaml"));
const util = __importStar(require("../util"));
const awaitableReadFile = util_1.promisify(fs_1.readFile);
const awaitableReadDir = util_1.promisify(fs_1.readdir);
function load(path) {
    return __awaiter(this, void 0, void 0, function* () {
        let target = '';
        if (typeof path === 'string' && path.length > 0) {
            target = path;
        }
        else {
            const wellKnown = yield determineWellKnownPath();
            if (wellKnown) {
                target = wellKnown;
            }
        }
        if (target.length === 0) {
            throw new Error('unable to determine configuration path');
        }
        const content = yield awaitableReadFile(target, { encoding: 'utf-8' });
        const config = yaml_1.default.parse(content);
        return config;
    });
}
exports.load = load;
const wellKnownLocations = [
    'protector.yml',
    'protector.yaml',
    'branch_protection.yml',
    'branch_protection.yaml',
    'protection.yml',
    'protection.yaml'
];
function determineWellKnownPath() {
    return __awaiter(this, void 0, void 0, function* () {
        const directory = yield awaitableReadDir('.github/');
        const file = wellKnownLocations.find(location => directory.includes(location));
        if (!file) {
            return null;
        }
        return `./.github/${file}`;
    });
}
/**
 * Translates the given BranchProtectionRule to an internal Protection.
 */
function translate(rule) {
    if (!rule) {
        return null;
    }
    const { reviewDismissalAllowances, pushAllowances, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    __typename, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pattern } = rule, rest = __rest(rule, ["reviewDismissalAllowances", "pushAllowances", "__typename", "id", "pattern"]);
    return Object.assign(Object.assign({}, rest), { requiredStatusCheckContexts: rest.requiredStatusCheckContexts
            ? lodash_clone_1.default(rest.requiredStatusCheckContexts)
            : [], reviewDismissalActors: (reviewDismissalAllowances.edges || [])
            .reduce((accumulator, edge) => {
            var _a;
            const actor = (_a = edge === null || edge === void 0 ? void 0 : edge.node) === null || _a === void 0 ? void 0 : _a.actor;
            if ((actor === null || actor === void 0 ? void 0 : actor.__typename) === 'User') {
                return [...accumulator, `@${actor.userHandle}`];
            }
            else if ((actor === null || actor === void 0 ? void 0 : actor.__typename) === 'Team') {
                return [...accumulator, `#${actor.teamHandle}`];
            }
            return accumulator;
        }, [])
            .filter(util.filterUnique), pushActors: (pushAllowances.edges || [])
            .reduce((accumulator, edge) => {
            var _a;
            const actor = (_a = edge === null || edge === void 0 ? void 0 : edge.node) === null || _a === void 0 ? void 0 : _a.actor;
            if ((actor === null || actor === void 0 ? void 0 : actor.__typename) === 'User') {
                return [...accumulator, `@${actor.userHandle}`];
            }
            else if ((actor === null || actor === void 0 ? void 0 : actor.__typename) === 'Team') {
                return [...accumulator, `#${actor.teamHandle}`];
            }
            return accumulator;
        }, [])
            .filter(util.filterUnique) });
}
exports.translate = translate;
/**
 * Determines the actual `Specification` for the passed `search` `Pattern`.
 *
 * @param specification
 * @param search
 */
function extractByPattern(_a, search) {
    var _b;
    var { patterns, overrides } = _a, rest = __rest(_a, ["patterns", "overrides"]);
    if (!(patterns || []).includes(search)) {
        return null;
    }
    const matched = deepmerge_1.default(rest, (overrides || {})[search]);
    if (matched.pushActors) {
        matched.pushActors = matched.pushActors.filter(util.filterUnique);
    }
    if (matched.reviewDismissalActors) {
        matched.reviewDismissalActors = matched.reviewDismissalActors.filter(util.filterUnique);
    }
    if (matched.requiredStatusCheckContexts) {
        matched.requiredStatusCheckContexts =
            ((_b = matched.requiredStatusCheckContexts) === null || _b === void 0 ? void 0 : _b.filter(util.filterUnique)) || [];
    }
    return Object.freeze(matched);
}
exports.extractByPattern = extractByPattern;
const defaultSpecification = {
    requiredApprovingReviewCount: 1,
    allowsDeletions: false,
    allowsForcePushes: false,
    dismissesStaleReviews: false,
    isAdminEnforced: false,
    requiresApprovingReviews: false,
    requiresCodeOwnerReviews: false,
    requiresCommitSignatures: false,
    requiresLinearHistory: false,
    requiresStatusChecks: false,
    restrictsPushes: false,
    restrictsReviewDismissals: false,
    requiresStrictStatusChecks: false,
    requiredStatusCheckContexts: [],
    reviewDismissalActors: [],
    pushActors: []
};
function isEqual(current, desired) {
    if (Array.isArray(current) && Array.isArray(desired)) {
        return desired.every(value => current.includes(value));
    }
    if (current === desired) {
        return true;
    }
    return false;
}
function diff(current, desired) {
    const keys = [
        ...Object.keys(current),
        ...Object.keys(desired)
    ].filter((value, index, self) => self.indexOf(value) === index);
    const result = keys.reduce((accumulator, key) => {
        if (key in desired) {
            if (key in current && isEqual(current[key], desired[key])) {
                return accumulator;
            }
            return Object.assign(Object.assign({}, accumulator), { [key]: desired[key] });
        }
        if (!(key in desired) && key in current) {
            return Object.assign(Object.assign({}, accumulator), { [key]: lodash_clone_1.default(defaultSpecification[key]) });
        }
        return accumulator;
    }, {});
    if (Object.keys(result).length === 0) {
        return null;
    }
    return result;
}
exports.diff = diff;
