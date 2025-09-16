import { apiClient } from '../../utils/api-client';
import { config } from '../../utils/config';
import axios from 'axios';

beforeAll(() => {
    // Проверяем, что необходимые переменные окружения установлены
    if (!config.api.token) {
        throw new Error('GITHUB_API_TOKEN is not set');
    }
    if (!config.api.owner) {
        throw new Error('GITHUB_REPO_OWNER is not set');
    }
    if (!config.api.repo) {
        throw new Error('GITHUB_REPO_NAME is not set');
    }
});

beforeAll(async () => {
    // Проверяем, что репозиторий существует
    try {
        const response = await axios.get(
            `${config.api.baseUrl}/repos/${config.api.owner}/${config.api.repo}`,
            {
                headers: {
                    'Authorization': `Bearer ${config.api.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (response.status !== 200) {
            throw new Error(`Repository ${config.api.owner}/${config.api.repo} does not exist or is not accessible`);
        }
    } catch (error) {
        throw new Error(`Repository ${config.api.owner}/${config.api.repo} does not exist or is not accessible: ${error.message}`);
    }
});

describe('GitHub API Issues', () => {
    let createdIssueNumber: number | undefined;

    afterEach(async () => {
        if (createdIssueNumber) {
            try {
                await apiClient.closeIssue(createdIssueNumber);
            } catch (error) {
                console.log('Failed to close issue:', (error as Error).message);
            }
        }
    });

    it('POSITIVE: should create an issue with valid data (201 Created)', async () => {
        const response = await apiClient.createIssue(
            config.testData.issueTitle,
            config.testData.issueBody
        );

        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        expect(response.data).toHaveProperty('number');
        expect(response.data).toHaveProperty('title');
        expect(response.data).toHaveProperty('body');
        expect(response.data).toHaveProperty('state');
        expect(response.data.title).toBe(config.testData.issueTitle);
        expect(response.data.body).toBe(config.testData.issueBody);
        expect(response.data.state).toBe('open');

        createdIssueNumber = response.data.number;
    });

    test('NEGATIVE: should return error when creating issue without title (422 Unprocessable Entity)', async () => {
        try {
            await apiClient.createIssue(config.testData.emptyIssueTitle);
            expect(true).toBe(false); // Это заставит тест упасть
        } catch (error) {
            expect((error as any).response).toBeDefined();
            expect((error as any).response.status).toBe(422);
            expect((error as any).response.data).toHaveProperty('message');
            // Изменяем ожидаемое сообщение об ошибке
            expect((error as any).response.data.message).toContain('Validation Failed');
        }
    });

    test('NEGATIVE: should return error with invalid authentication (401 Unauthorized)', async () => {
        // Вместо мокирования axios, создадим отдельный экземпляр apiClient с неверным токеном
        const invalidApiClient = {
            createIssue: async (title: string, body?: string) => {
                const axios = require('axios');
                const url = `${config.api.baseUrl}/repos/${config.api.owner}/${config.api.repo}/issues`;

                return axios.post(url, { title, body }, {
                    headers: {
                        'Authorization': 'Bearer invalid_token_123',
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    }
                });
            }
        };

        try {
            await invalidApiClient.createIssue(config.testData.issueTitle);
            expect(true).toBe(false); // Это заставит тест упасть
        } catch (error) {
            expect((error as any).response).toBeDefined();
            expect((error as any).response.status).toBe(401);
            expect((error as any).response.data).toHaveProperty('message');
        }
    });

    test('NEGATIVE: should return error when repository does not exist (404 Not Found)', async () => {
        try {
            // Пытаемся создать issue в несуществующем репозитории
            const response = await axios.post(
                `${config.api.baseUrl}/repos/${config.api.owner}/nonexistent-repo/issues`,
                {
                    title: config.testData.issueTitle,
                    body: config.testData.issueBody
                },
                {
                    headers: {
                        'Authorization': `Bearer ${config.api.token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    validateStatus: () => true // Чтобы axios не выбрасывал исключение при статусах ошибок
                }
            );

            // Проверяем, что получили ошибку 404
            expect(response.status).toBe(404);
            expect(response.data).toHaveProperty('message');
        } catch (error) {
            // Если запрос все же выбросил исключение, проверяем его
            expect((error as any).response).toBeDefined();
            expect((error as any).response.status).toBe(404);
            expect((error as any).response.data).toHaveProperty('message');
        }
    });
});