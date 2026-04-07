import distro

def get_distro_family() -> str:
    """
    Detects the Linux distribution family.
    
    Returns:
        str: 'arch', 'fedora', 'debian', or 'unknown'
    """
    d = distro.id().lower()
    if d in ('arch', 'cachyos', 'manjaro', 'endeavouros'):
        return 'arch'
    elif d in ('fedora', 'rhel', 'centos'):
        return 'fedora'
    elif d in ('ubuntu', 'debian', 'linuxmint', 'pop', 'kali'):
        return 'debian'
    return 'unknown'
