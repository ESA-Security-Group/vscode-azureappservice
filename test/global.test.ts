/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { TestOutputChannel, TestUserInput } from 'vscode-azureextensiondev';
import { IActionContext } from 'vscode-azureextensionui';
import { ext } from '../extension.bundle';

export const longRunningTestsEnabled: boolean = !/^(false|0)?$/i.test(process.env.ENABLE_LONG_RUNNING_TESTS || '');

export type ITestContext = IActionContext & { ui: TestUserInput };

export function createTestContext(): ITestContext {
    return { telemetry: { properties: {}, measurements: {} }, errorHandling: { issueProperties: {} }, valuesToMask: [], ui: new TestUserInput(vscode) };
}

/**
 * Extension-wide TestUserInput that can't be used in parallel, unlike `createTestContext().ui`
 */
export const testUserInput: TestUserInput = new TestUserInput(vscode);

// Runs before all tests
suiteSetup(async function (this: Mocha.Context): Promise<void> {
    this.timeout(120 * 1000);
    await vscode.commands.executeCommand('appService.Refresh'); // activate the extension before tests begin
    ext.outputChannel = new TestOutputChannel();
    ext.ui = testUserInput;
});
