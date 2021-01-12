

export { config, env}

const env = {
    LOCAL: "local",
    PROD: "prod",
}

const config = {
    lang: 'de',
    langTranslations: ['de', 'en'],
    environment: env.PROD,
    startMenuEntry: 0,
};
