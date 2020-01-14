/** Copyright 2013-2020 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const _ = require('lodash');
const { Lexer, createToken } = require('chevrotain');
const { NAME, KEYWORD, namePattern } = require('./shared_tokens');
const minMaxTokenConfigs = require('./minmax_token_configs');
const applicationTokenConfigs = require('./application_token_configs');

const tokens = {};

function createTokenFromConfig(config) {
  // JDL has a great many keywords. Keywords can conflict with identifiers in a parsing
  // library with a separate lexing phase.
  // See: https://github.com/SAP/chevrotain/blob/master/examples/lexer/keywords_vs_identifiers/keywords_vs_identifiers.js
  // a Concise way to resolve the problem without manually adding the "longer_alt" property dozens of times.
  if (_.isString(config.pattern) && namePattern.test(config.pattern)) {
    config.longer_alt = NAME;
    if (!config.categories) {
      // e.g. 'application' IS-A KEYWORD which in turn IS-A NAME
      config.categories = KEYWORD;
    } else {
      config.categories.push(KEYWORD);
    }
  }

  // readable labels for diagrams
  if (_.isString(config.pattern) && !config.label) {
    config.label = `'${config.pattern}'`;
  }

  // concisely collects all tokens to be exported
  const newToken = createToken(config);
  tokens[config.name] = newToken;
  return newToken;
}

// Some categories to make the grammar easier to read
const BOOLEAN = createTokenFromConfig({
  name: 'BOOLEAN',
  pattern: Lexer.NA
});

// Category For the Application Configuration key names
const CONFIG_KEY = createTokenFromConfig({
  name: 'CONFIG_KEY',
  pattern: Lexer.NA
});

// Category For the Application deployment key names
const DEPLOYMENT_KEY = createTokenFromConfig({
  name: 'DEPLOYMENT_KEY',
  pattern: Lexer.NA
});

createTokenFromConfig({
  name: 'WHITESPACE',
  pattern: /[\n\t\r \u2028\u2029]+/,
  // Whitespace insensitivity for the win.
  group: Lexer.SKIPPED
});

// Comments
createTokenFromConfig({
  name: 'JAVADOC',
  pattern: /\/\*\*([\s\S]*?)\*\//
});

// Comments
createTokenFromConfig({
  name: 'BLOCK_COMMENT',
  pattern: /\/\*([\s\S]*?)\*\//,
  group: Lexer.SKIPPED
});

// Constants
// Application constants
createTokenFromConfig({ name: 'CONFIG', pattern: 'config' });
createTokenFromConfig({ name: 'ENTITIES', pattern: 'entities' });

applicationTokenConfigs.forEach(tokenConfig => {
  createTokenFromConfig({
    ...tokenConfig,
    categories: [CONFIG_KEY]
  });
});

// application must appear AFTER "applicationType" due to shorter common prefix.
createTokenFromConfig({ name: 'APPLICATION', pattern: 'application' });

// this is used in application config and deployment
createTokenFromConfig({
  name: 'SERVICE_DISCOVERY_TYPE',
  pattern: 'serviceDiscoveryType',
  categories: [CONFIG_KEY, DEPLOYMENT_KEY]
});
createTokenFromConfig({
  name: 'DEPLOYMENT_TYPE',
  pattern: 'deploymentType',
  categories: [DEPLOYMENT_KEY]
});
createTokenFromConfig({ name: 'DEPLOYMENT', pattern: 'deployment' });
createTokenFromConfig({
  name: 'GATEWAY_TYPE',
  pattern: 'gatewayType',
  categories: [DEPLOYMENT_KEY]
});
createTokenFromConfig({
  name: 'MONITORING',
  pattern: 'monitoring',
  categories: [DEPLOYMENT_KEY]
});
createTokenFromConfig({
  name: 'DIRECTORY_PATH',
  pattern: 'directoryPath',
  categories: [DEPLOYMENT_KEY]
});
createTokenFromConfig({
  name: 'APPS_FOLDERS',
  pattern: 'appsFolders',
  categories: [DEPLOYMENT_KEY]
});
createTokenFromConfig({
  name: 'CLUSTERED_DB_APPS',
  pattern: 'clusteredDbApps',
  categories: [DEPLOYMENT_KEY]
});
createTokenFromConfig({
  name: 'CONSOLE_OPTIONS',
  pattern: 'consoleOptions',
  categories: [DEPLOYMENT_KEY]
});
// This is not secure, need to find a better way
/* createTokenFromConfig({
  name: 'ADMIN_PASSWORD',
  pattern: 'adminPassword',
  categories: [DEPLOYMENT_KEY]
}); */

createTokenFromConfig({
  name: 'DOCKER_REPOSITORY_NAME',
  pattern: 'dockerRepositoryName',
  categories: [DEPLOYMENT_KEY]
});
createTokenFromConfig({
  name: 'DOCKER_PUSH_COMMAND',
  pattern: 'dockerPushCommand',
  categories: [DEPLOYMENT_KEY]
});
createTokenFromConfig({
  name: 'KUBERNETES_NAMESPACE',
  pattern: 'kubernetesNamespace',
  categories: [DEPLOYMENT_KEY]
});
createTokenFromConfig({
  name: 'KUBERNETES_SERVICE_TYPE',
  pattern: 'kubernetesServiceType',
  categories: [DEPLOYMENT_KEY]
});
createTokenFromConfig({
  name: 'INGRESS_DOMAIN',
  pattern: 'ingressDomain',
  categories: [DEPLOYMENT_KEY]
});
createTokenFromConfig({
  name: 'ISTIO',
  pattern: 'istio',
  categories: [DEPLOYMENT_KEY]
});
createTokenFromConfig({
  name: 'OPENSHIFT_NAMESPACE',
  pattern: 'openshiftNamespace',
  categories: [DEPLOYMENT_KEY]
});
createTokenFromConfig({
  name: 'STORAGE_TYPE',
  pattern: 'storageType',
  categories: [DEPLOYMENT_KEY]
});

// boolean value constants
createTokenFromConfig({ name: 'TRUE', pattern: 'true', categories: [BOOLEAN] });
createTokenFromConfig({ name: 'FALSE', pattern: 'false', categories: [BOOLEAN] });
// Entity constants
createTokenFromConfig({ name: 'ENTITY', pattern: 'entity' });
createTokenFromConfig({ name: 'ENUM', pattern: 'enum' });
// Relationship-related
createTokenFromConfig({ name: 'RELATIONSHIP', pattern: 'relationship' });
createTokenFromConfig({ name: 'JPA_DERIVED_IDENTIFIER', pattern: 'jpaDerivedIdentifier' });
createTokenFromConfig({ name: 'ONE_TO_ONE', pattern: 'OneToOne' });
createTokenFromConfig({ name: 'ONE_TO_MANY', pattern: 'OneToMany' });
createTokenFromConfig({ name: 'MANY_TO_ONE', pattern: 'ManyToOne' });
createTokenFromConfig({ name: 'MANY_TO_MANY', pattern: 'ManyToMany' });

// Options
createTokenFromConfig({ name: 'TO', pattern: 'to' });
createTokenFromConfig({ name: 'STAR', pattern: '*' });
createTokenFromConfig({ name: 'WITH', pattern: 'with' });
createTokenFromConfig({ name: 'EXCEPT', pattern: 'except' });
createTokenFromConfig({ name: 'CLIENT_ROOT_FOLDER', pattern: 'clientRootFolder' });
createTokenFromConfig({ name: 'NO_FLUENT_METHOD', pattern: 'noFluentMethod' });
createTokenFromConfig({ name: 'READ_ONLY', pattern: 'readOnly' });
createTokenFromConfig({ name: 'DTO', pattern: 'dto' });
createTokenFromConfig({ name: 'PAGINATE', pattern: 'paginate' });
createTokenFromConfig({ name: 'SERVICE', pattern: 'service' });
createTokenFromConfig({ name: 'MICROSERVICE', pattern: 'microservice' });
createTokenFromConfig({ name: 'SEARCH', pattern: 'search' });
createTokenFromConfig({
  name: 'SKIP_CLIENT',
  pattern: 'skipClient',
  categories: [CONFIG_KEY]
});
createTokenFromConfig({
  name: 'SKIP_SERVER',
  pattern: 'skipServer',
  categories: [CONFIG_KEY]
});
createTokenFromConfig({ name: 'ANGULAR_SUFFIX', pattern: 'angularSuffix' });
createTokenFromConfig({ name: 'FILTER', pattern: 'filter' });

// validations
createTokenFromConfig({ name: 'REQUIRED', pattern: 'required' });
createTokenFromConfig({ name: 'UNIQUE', pattern: 'unique' });

const MIN_MAX_KEYWORD = createTokenFromConfig({
  name: 'MIN_MAX_KEYWORD',
  pattern: Lexer.NA,
  categories: KEYWORD
});

minMaxTokenConfigs.forEach(tokenConfig => {
  createTokenFromConfig({
    ...tokenConfig,
    categories: [MIN_MAX_KEYWORD]
  });
});
createTokenFromConfig({ name: 'PATTERN', pattern: 'pattern' });

createTokenFromConfig({ name: 'REGEX', pattern: /\/[^\n\r]*\// });
createTokenFromConfig({ name: 'INTEGER', pattern: /-?\d+/ });
// No escaping, no unicode, just a plain string literal
createTokenFromConfig({ name: 'STRING', pattern: /"(?:[^"])*"/ });

// punctuation
createTokenFromConfig({ name: 'LPAREN', pattern: '(' });
createTokenFromConfig({ name: 'RPAREN', pattern: ')' });
createTokenFromConfig({ name: 'LCURLY', pattern: '{' });
createTokenFromConfig({ name: 'RCURLY', pattern: '}' });
createTokenFromConfig({ name: 'LSQUARE', pattern: '[' });
createTokenFromConfig({ name: 'RSQUARE', pattern: ']' });
createTokenFromConfig({ name: 'COMMA', pattern: ',' });
createTokenFromConfig({ name: 'COMMA_WITHOUT_NEWLINE', pattern: /,[^\n\r]/ });
createTokenFromConfig({ name: 'EQUALS', pattern: '=' });
createTokenFromConfig({ name: 'DOT', pattern: '.' });

// annotations
createTokenFromConfig({ name: 'AT', pattern: '@' });

// Imperative the "NAME" token will be added after all the keywords to resolve keywords vs identifier conflict.
tokens.NAME = NAME;

// with 'ensureOptimizations' the lexer initialization will throw a descriptive error
// instead of silently reverting to an unoptimized algorithm.
// This will avoid performance regressions.
const JDLLexer = new Lexer(_.values(tokens), { ensureOptimizations: true });

// Cannot exporters constants before they have been defined (unlike functions...)
module.exports = {
  tokens,
  JDLLexer
};