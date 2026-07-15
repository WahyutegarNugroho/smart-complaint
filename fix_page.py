filepath = r"C:\xampp\htdocs\smart-complaint-app\src\app\dashboard\admin\users\page.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """      totalUsers = await prisma.profile.count({ where: whereClause })

      allUsers = await prisma.profile.findMany({
         where: whereClause,
         orderBy: { createdAt: 'desc' },
         skip: (page - 1) * PAGE_SIZE,
         take: PAGE_SIZE
      })"""

new_code = """      [totalUsers, allUsers] = await Promise.all([
        prisma.profile.count({ where: whereClause }),
        prisma.profile.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE
        }),
      ])"""

if old_code in content:
    content = content.replace(old_code, new_code)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("File updated successfully")
else:
    print("Old code not found!")
    import re
    matches = list(re.finditer(r'totalUsers\s*=\s*await prisma\.profile\.count', content))
    for m in matches:
        print(f"Found at position {m.start()}: {content[m.start():m.start()+100]}")