export function getAttributesUIStyle(entry) {
    const style = {};
    if (entry && entry.attributes_ui) {
        if (entry.attributes_ui.color) style.backgroundColor = entry.attributes_ui.color;
        if (entry.attributes_ui.text_color) style.color = entry.attributes_ui.text_color;
    }
    return style;
}
