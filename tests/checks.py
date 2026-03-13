from pathlib import Path

REPO = Path("/app")


def test_lib_analysis_exports():
    content = (REPO / "lib/analysis.ts").read_text()
    assert "export function analyzeJson" in content
    assert "export interface AnalysisIssue" in content


def test_lib_converters_exports():
    content = (REPO / "lib/converters.ts").read_text()
    assert "export function jsonToTypescript" in content
    assert "export function jsonToZod" in content
    assert "export function jsonToPydantic" in content


def test_lib_json_utils_exports():
    content = (REPO / "lib/json-utils.ts").read_text()
    assert "export function validateJson" in content
    assert "export function formatJson" in content
    assert "export function minifyJson" in content


def test_lib_performance_utils_exports():
    content = (REPO / "lib/performance-utils.ts").read_text()
    assert "export function getAdaptiveDebounce" in content
    assert "export function shouldEnableTreeView" in content
    assert "export function getEditorOptions" in content


def test_worker_handles_validate_json():
    content = (REPO / "workers/process.worker.ts").read_text()
    assert "VALIDATE_JSON" in content
    assert "JSON.parse(payload)" in content


def test_worker_handles_flatten_json():
    content = (REPO / "workers/process.worker.ts").read_text()
    assert "FLATTEN_JSON" in content
    assert "flattenObject" in content


def test_json_editor_uses_worker():
    content = (REPO / "components/features/JsonEditor.tsx").read_text()
    assert "useWorker" in content
    assert "runTask" in content


def test_tree_view_uses_virtualization():
    content = (REPO / "components/features/TreeView.tsx").read_text()
    assert "react-window" in content
    assert "List" in content


def test_converter_layout_bidirectional():
    content = (REPO / "components/features/ConverterLayout.tsx").read_text()
    assert "toTarget" in content
    assert "toJson" in content


def test_app_routes_exist():
    assert (REPO / "app/json-formatter").is_dir()
    assert (REPO / "app/json-diff-tool").is_dir()
    assert (REPO / "app/debug-invalid-json").is_dir()
    assert (REPO / "app/convert-json-to-typescript").is_dir()
