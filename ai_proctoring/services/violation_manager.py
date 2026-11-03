from datetime import datetime


class ViolationManager:
    def __init__(self):
        self.violations = []

    def record_violation(self, violation_type, details=None):
        violation = {
            "type": violation_type,
            "details": details or {},
            "timestamp": datetime.now().isoformat()
        }

        self.violations.append(violation)
        return violation

    def get_violations(self):
        return self.violations

    def get_violation_count(self):
        return len(self.violations)

    def clear_violations(self):
        self.violations.clear()