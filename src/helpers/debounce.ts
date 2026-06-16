type DebouncedFunction<T extends (...args: any[]) => void> = {
  (...args: Parameters<T>): void
  cancel: () => void
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  // 1. สร้างฟังก์ชันหลักที่จะถูกเรียกใช้งาน
  const debounced = (...args: Parameters<T>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
    }, wait)
  }

  // 2. แปะเมธอด .cancel เข้าไปที่ตัวฟังก์ชันโดยตรง
  debounced.cancel = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced
}
