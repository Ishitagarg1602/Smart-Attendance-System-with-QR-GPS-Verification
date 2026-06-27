import LocationZone from '../models/locationZone.model.js';

export const createZone = async (req, res, next) => {
  try {
    const { zoneName, latitude, longitude, radius, description } = req.body;
    const createdBy = req.user.id;

    const zoneExists = await LocationZone.findOne({ zoneName });
    if (zoneExists) {
      return res.status(400).json({ success: false, message: 'Location zone already exists' });
    }

    const newZone = await LocationZone.create({
      zoneName,
      latitude,
      longitude,
      radius,
      description,
      createdBy
    });

    res.status(201).json({ success: true, message: 'Location zone created successfully', data: newZone });
  } catch (error) {
    next(error);
  }
};

export const getAllZones = async (req, res, next) => {
  try {
    const zones = await LocationZone.find({ isActive: true }).populate('createdBy', 'fullName email');
    res.status(200).json({ success: true, count: zones.length, data: zones });
  } catch (error) {
    next(error);
  }
};

export const updateZone = async (req, res, next) => {
  try {
    const updatedZone = await LocationZone.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedZone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }
    res.status(200).json({ success: true, message: 'Zone updated', data: updatedZone });
  } catch (error) {
    next(error);
  }
};

export const deleteZone = async (req, res, next) => {
  try {
    // Soft delete
    const deletedZone = await LocationZone.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!deletedZone) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }
    res.status(200).json({ success: true, message: 'Zone deleted successfully' });
  } catch (error) {
    next(error);
  }
};
