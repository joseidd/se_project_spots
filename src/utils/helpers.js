export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  LoadingText = "Saving..."
) {
  if (isLoading) {
    btn.textContent = LoadingText;
    btn.disabled = true;
  } else {
    btn.textContent = defaultText;
  }
}
