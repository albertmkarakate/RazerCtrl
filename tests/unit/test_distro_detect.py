"""Tests for razerctrl.utils.distro_detect."""
from unittest.mock import patch

from razerctrl.utils.distro_detect import get_distro_family


class TestGetDistroFamily:
    """Tests for Linux distribution family detection."""

    @patch("razerctrl.utils.distro_detect.distro")
    def test_arch_linux(self, mock_distro):
        mock_distro.id.return_value = "arch"
        assert get_distro_family() == "arch"

    @patch("razerctrl.utils.distro_detect.distro")
    def test_cachyos(self, mock_distro):
        mock_distro.id.return_value = "cachyos"
        assert get_distro_family() == "arch"

    @patch("razerctrl.utils.distro_detect.distro")
    def test_manjaro(self, mock_distro):
        mock_distro.id.return_value = "manjaro"
        assert get_distro_family() == "arch"

    @patch("razerctrl.utils.distro_detect.distro")
    def test_endeavouros(self, mock_distro):
        mock_distro.id.return_value = "endeavouros"
        assert get_distro_family() == "arch"

    @patch("razerctrl.utils.distro_detect.distro")
    def test_fedora(self, mock_distro):
        mock_distro.id.return_value = "fedora"
        assert get_distro_family() == "fedora"

    @patch("razerctrl.utils.distro_detect.distro")
    def test_rhel(self, mock_distro):
        mock_distro.id.return_value = "rhel"
        assert get_distro_family() == "fedora"

    @patch("razerctrl.utils.distro_detect.distro")
    def test_centos(self, mock_distro):
        mock_distro.id.return_value = "centos"
        assert get_distro_family() == "fedora"

    @patch("razerctrl.utils.distro_detect.distro")
    def test_ubuntu(self, mock_distro):
        mock_distro.id.return_value = "ubuntu"
        assert get_distro_family() == "debian"

    @patch("razerctrl.utils.distro_detect.distro")
    def test_debian(self, mock_distro):
        mock_distro.id.return_value = "debian"
        assert get_distro_family() == "debian"

    @patch("razerctrl.utils.distro_detect.distro")
    def test_linuxmint(self, mock_distro):
        mock_distro.id.return_value = "linuxmint"
        assert get_distro_family() == "debian"

    @patch("razerctrl.utils.distro_detect.distro")
    def test_pop_os(self, mock_distro):
        mock_distro.id.return_value = "pop"
        assert get_distro_family() == "debian"

    @patch("razerctrl.utils.distro_detect.distro")
    def test_kali(self, mock_distro):
        mock_distro.id.return_value = "kali"
        assert get_distro_family() == "debian"

    @patch("razerctrl.utils.distro_detect.distro")
    def test_unknown_distro(self, mock_distro):
        mock_distro.id.return_value = "gentoo"
        assert get_distro_family() == "unknown"

    @patch("razerctrl.utils.distro_detect.distro")
    def test_empty_string(self, mock_distro):
        mock_distro.id.return_value = ""
        assert get_distro_family() == "unknown"

    @patch("razerctrl.utils.distro_detect.distro")
    def test_case_insensitive_uppercase(self, mock_distro):
        """distro.id() should return lowercase, but we verify .lower() works."""
        mock_distro.id.return_value = "Ubuntu"
        assert get_distro_family() == "debian"
