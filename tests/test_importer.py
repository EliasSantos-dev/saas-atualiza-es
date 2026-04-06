import os
import json
import pytest
from src.engine.importer import generate_hash, build_manifest

def test_generate_hash(tmp_path):
    test_file = tmp_path / "test.mp3"
    test_file.write_bytes(b"dummy content")
    # SHA-256 for "dummy content"
    expected_hash = "bf0ecbdb9b814248d086c9b69cf26182d9d4138f2ad3d0637c4555fc8cbf68e5"
    assert generate_hash(str(test_file)) == expected_hash

def test_build_manifest(tmp_path):
    d = tmp_path / "01_HITS"
    d.mkdir()
    f = d / "music1.mp3"
    f.write_bytes(b"content")
    
    manifest = build_manifest(str(tmp_path), "test_profile", "v1")
    assert manifest["profile_id"] == "test_profile"
    assert manifest["version"] == "v1"
    assert len(manifest["files"]) == 1
    assert manifest["files"][0]["path"] == "01_HITS/music1.mp3"
    assert "hash" in manifest["files"][0]
