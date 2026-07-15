file_path = r"C:\xampp\htdocs\smart-complaint-app\src\components\map\LocationPicker.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace reverseGeocode function
old_reverse_geocode = '''  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`,
        { headers: { 'User-Agent': 'SmartComplaintApp/1.0' } }
      )
      const data = await res.json()
      if (data.display_name) {
        setAddress(data.display_name)
        setSearchQuery(data.display_name)
      }
    } catch {
      // silent fail \u2014 user can type address manually
    }
  }'''

new_reverse_geocode = '''  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `/api/geocode?action=reverse&lat=${lat}&lon=${lng}`
      )
      const data = await res.json()
      if (data.display_name) {
        setAddress(data.display_name)
        setSearchQuery(data.display_name)
      }
    } catch {
      // silent fail \u2014 user can type address manually
    }
  }'''

content = content.replace(old_reverse_geocode, new_reverse_geocode)

# Replace handleSearch function
old_handle_search = '''  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&accept-language=id`,
        { headers: { 'User-Agent': 'SmartComplaintApp/1.0' } }
      )
      const data = await res.json()
      if (data.length > 0) {
        const newLat = parseFloat(data[0].lat)
        const newLng = parseFloat(data[0].lon)
        setLat(newLat)
        setLng(newLng)
        setAddress(data[0].display_name)
      }
    } catch {
      // silent fail
    } finally {
      setSearching(false)
    }
  }'''

new_handle_search = '''  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(
        `/api/geocode?action=search&q=${encodeURIComponent(searchQuery)}`
      )
      const data = await res.json()
      if (data.length > 0) {
        const newLat = parseFloat(data[0].lat)
        const newLng = parseFloat(data[0].lon)
        setLat(newLat)
        setLng(newLng)
        setAddress(data[0].display_name)
      }
    } catch {
      // silent fail
    } finally {
      setSearching(false)
    }
  }'''

content = content.replace(old_handle_search, new_handle_search)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("File updated successfully")