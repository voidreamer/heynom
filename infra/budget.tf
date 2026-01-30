variable "budget_limit_usd" {
  description = "Monthly budget limit in USD"
  type        = string
  default     = "10"
}

variable "budget_alert_email" {
  description = "Email to notify when budget thresholds are hit"
  type        = string
  default     = ""
}

resource "aws_budgets_budget" "monthly" {
  name         = "${var.project_name}-monthly-${var.environment}"
  budget_type  = "COST"
  limit_amount = var.budget_limit_usd
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  dynamic "notification" {
    for_each = var.budget_alert_email != "" ? [50, 80, 100] : []
    content {
      comparison_operator        = "GREATER_THAN"
      threshold                  = notification.value
      threshold_type             = "PERCENTAGE"
      notification_type          = "ACTUAL"
      subscriber_email_addresses = [var.budget_alert_email]
    }
  }
}
