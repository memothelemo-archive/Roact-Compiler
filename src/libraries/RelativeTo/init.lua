local RelativeTo = {}

local function PointToVector2(origin: Vector2, pos: Vector2)
    return origin - pos
end

function RelativeTo.Vector2OnElement(position: Vector2, elementPosition: Vector2)
    if position == nil then
        return UDim2.new()
    end
    local relativeVector2 = PointToVector2(position, elementPosition)
    return UDim2.fromOffset(relativeVector2.X, relativeVector2.Y)
end

return RelativeTo