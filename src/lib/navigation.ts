function normalizePath(path: string) {
  if (path === '/') {
    return path
  }

  return path.replace(/\/+$/, '')
}

export function isNavItemActive(pathname: string, href: string) {
  const currentPath = normalizePath(pathname)
  const targetPath = normalizePath(href)

  if (targetPath === '/') {
    return currentPath === '/'
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
}
