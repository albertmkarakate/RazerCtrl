from __future__ import annotations

import distro

ARCH_FAMILY = {"arch", "cachyos", "manjaro", "endeavouros", "garuda"}
FEDORA_FAMILY = {"fedora", "rhel", "centos", "rocky", "almalinux"}
DEBIAN_FAMILY = {"debian", "ubuntu", "linuxmint", "pop", "kali", "lmde"}


def get_distro_family() -> str:
    """
    Detect the Linux distribution family.

    Returns:
        'arch', 'fedora', 'debian', or 'unknown'
    """
    distro_id = distro.id().strip().lower()
    like_ids = {
        part.strip().lower()
        for part in distro.like().replace(",", " ").split()
        if part.strip()
    }

    candidates = {distro_id, *like_ids}

    if candidates & ARCH_FAMILY:
        return "arch"
    if candidates & FEDORA_FAMILY:
        return "fedora"
    if candidates & DEBIAN_FAMILY:
        return "debian"

    return "unknown"
